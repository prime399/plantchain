"use node";

import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { v } from "convex/values";

import { internal } from "./_generated/api";
import { internalAction } from "./_generated/server";

async function getAuth0Token(): Promise<string> {
  const domain = process.env.AUTH0_DOMAIN;
  const clientId = process.env.AUTH0_AGENT_CLIENT_ID;
  const clientSecret = process.env.AUTH0_AGENT_CLIENT_SECRET;
  const audience = process.env.AUTH0_AUDIENCE;

  if (!domain || !clientId || !clientSecret || !audience) {
    return "local-dev-agent";
  }

  const res = await fetch(`https://${domain}/oauth/token`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
      audience,
    }),
  });

  if (!res.ok) return "local-dev-agent";
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

export const verify = internalAction({
  args: { plantingId: v.id("plantings") },
  handler: async (ctx, { plantingId }) => {
    const agentToken = await getAuth0Token();
    const agentId = process.env.AUTH0_AGENT_CLIENT_ID ?? "local-dev-agent";

    const planting = await ctx.runQuery(internal.plantings.getInternal, { plantingId });
    if (!planting) return;

    const photoUrl = await ctx.storage.getUrl(planting.photoStorageId);

    const nearby = await ctx.runQuery(internal.plantings.findNearby, {
      latitude: planting.latitude,
      longitude: planting.longitude,
      radiusMeters: 5,
      excludeId: plantingId,
    });

    const duplicateWarning =
      nearby.length > 0
        ? `WARNING: There are ${nearby.length} verified planting(s) within 5 meters of this location. This may be a duplicate submission.`
        : "";

    const prompt = `You are a tree planting verification agent for PlantChain, a community reforestation registry.

Analyze this tree planting submission:
- Species: ${planting.species}
- Location: ${planting.latitude.toFixed(6)}, ${planting.longitude.toFixed(6)}
- Notes: ${planting.notes ?? "none"}
${duplicateWarning}

Look at the photo and determine:
1. Does the photo show a real tree or sapling that has been planted? (not a houseplant, not a fake, not an unrelated image)
2. Does the location appear to be valid (not 0,0 or clearly invalid coordinates)?
3. Is this likely a genuine new planting?

Respond in this exact JSON format:
{
  "passed": true or false,
  "reason": "one sentence explaining the decision",
  "tips": "one helpful tip for the planter (only if passed is true)"
}`;

    let passed = false;
    let reason = "Verification failed";
    let tips: string | undefined;

    try {
      const result = await generateText({
        model: google("gemini-2.5-flash"),
        messages: [
          {
            role: "user",
            content: photoUrl
              ? [
                  { type: "image", image: new URL(photoUrl) },
                  { type: "text", text: prompt },
                ]
              : [{ type: "text", text: prompt }],
          },
        ],
      });

      const text = result.text.trim();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]) as {
          passed: boolean;
          reason: string;
          tips?: string;
        };
        passed = parsed.passed && nearby.length === 0;
        reason = nearby.length > 0 && parsed.passed
          ? "Duplicate detected: another verified planting exists within 5 meters."
          : parsed.reason;
        tips = parsed.tips;
      }
    } catch {
      reason = "Verification service temporarily unavailable. Please resubmit.";
    }

    await ctx.runMutation(internal.plantings.updateVerification, {
      plantingId,
      passed,
      reason,
      tips,
      agentId,
    });

    void agentToken;
  },
});
