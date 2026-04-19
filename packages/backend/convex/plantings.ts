import { v } from "convex/values";

import { internal } from "./_generated/api";
import { internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const submit = mutation({
  args: {
    species: v.string(),
    latitude: v.float64(),
    longitude: v.float64(),
    locationName: v.optional(v.string()),
    photoStorageId: v.id("_storage"),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) throw new Error("Not authenticated");

    const plantingId = await ctx.db.insert("plantings", {
      userId: authUser._id,
      userName: authUser.name ?? undefined,
      species: args.species,
      latitude: args.latitude,
      longitude: args.longitude,
      locationName: args.locationName,
      photoStorageId: args.photoStorageId,
      notes: args.notes,
      status: "pending",
      createdAt: Date.now(),
    });

    await ctx.scheduler.runAfter(0, internal.verification.verify, { plantingId });
    return plantingId;
  },
});

export const list = query({
  args: {
    status: v.optional(
      v.union(v.literal("pending"), v.literal("verified"), v.literal("rejected")),
    ),
  },
  handler: async (ctx, { status }) => {
    const q = status
      ? ctx.db.query("plantings").withIndex("by_status", (q) => q.eq("status", status))
      : ctx.db.query("plantings").withIndex("by_created");
    const plantings = await q.order("desc").take(50);
    return Promise.all(
      plantings.map(async (p) => ({
        ...p,
        photoUrl: await ctx.storage.getUrl(p.photoStorageId),
      })),
    );
  },
});

export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) return [];
    const plantings = await ctx.db
      .query("plantings")
      .withIndex("by_user", (q) => q.eq("userId", authUser._id))
      .order("desc")
      .take(50);
    return Promise.all(
      plantings.map(async (p) => ({
        ...p,
        photoUrl: await ctx.storage.getUrl(p.photoStorageId),
      })),
    );
  },
});

export const stats = query({
  args: {},
  handler: async (ctx) => {
    const verified = await ctx.db
      .query("plantings")
      .withIndex("by_status", (q) => q.eq("status", "verified"))
      .collect();
    const all = await ctx.db.query("plantings").collect();
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const thisWeek = verified.filter((p) => p.createdAt > weekAgo).length;
    const uniquePlanters = new Set(verified.map((p) => p.userId)).size;
    return {
      totalVerified: verified.length,
      totalSubmitted: all.length,
      thisWeek,
      uniquePlanters,
    };
  },
});

export const getInternal = internalQuery({
  args: { plantingId: v.id("plantings") },
  handler: async (ctx, { plantingId }) => {
    return await ctx.db.get(plantingId);
  },
});

export const updateVerification = internalMutation({
  args: {
    plantingId: v.id("plantings"),
    passed: v.boolean(),
    reason: v.string(),
    tips: v.optional(v.string()),
    agentId: v.string(),
  },
  handler: async (ctx, { plantingId, passed, reason, tips, agentId }) => {
    await ctx.db.patch(plantingId, {
      status: passed ? "verified" : "rejected",
      verificationResult: {
        passed,
        reason,
        tips,
        agentId,
        verifiedAt: Date.now(),
      },
    });
  },
});

export const findNearby = internalQuery({
  args: {
    latitude: v.float64(),
    longitude: v.float64(),
    radiusMeters: v.float64(),
    excludeId: v.id("plantings"),
  },
  handler: async (ctx, { latitude, longitude, radiusMeters, excludeId }) => {
    const all = await ctx.db
      .query("plantings")
      .withIndex("by_status", (q) => q.eq("status", "verified"))
      .collect();
    const degPerMeter = 1 / 111320;
    const latDelta = radiusMeters * degPerMeter;
    const lngDelta = (radiusMeters * degPerMeter) / Math.cos((latitude * Math.PI) / 180);
    return all.filter(
      (p) =>
        p._id !== excludeId &&
        Math.abs(p.latitude - latitude) < latDelta &&
        Math.abs(p.longitude - longitude) < lngDelta,
    );
  },
});
