import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({}),
  userProfiles: defineTable({
    userId: v.string(),
    email: v.string(),
    updatedAt: v.optional(v.string()),
  }).index("by_userId", ["userId"]),
});
