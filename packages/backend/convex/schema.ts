import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  plantings: defineTable({
    userId: v.string(),
    userName: v.optional(v.string()),
    species: v.string(),
    latitude: v.float64(),
    longitude: v.float64(),
    locationName: v.optional(v.string()),
    photoStorageId: v.id("_storage"),
    notes: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("verified"),
      v.literal("rejected"),
    ),
    verificationResult: v.optional(
      v.object({
        passed: v.boolean(),
        reason: v.string(),
        tips: v.optional(v.string()),
        agentId: v.string(),
        verifiedAt: v.float64(),
      }),
    ),
    solanaTxSignature: v.optional(v.string()),
    createdAt: v.float64(),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_created", ["createdAt"]),
});
