import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { createAuth } from "../src/lib/auth";
import { betterAuthComponent } from "./auth";

export const getUserProfile = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const auth = createAuth(ctx);
    const headers = await betterAuthComponent.getHeaders(ctx);
    const session = await auth.api.getSession({
      headers,
    });
    console.log("getUserProfile session:", session);

    const profiles = await ctx.db.query("userProfiles").collect();
    return profiles.find((profile) => profile.userId === args.userId);
  },
});

export const getAllUserProfiles = query({
  handler: async (ctx) => {
    const auth = createAuth(ctx);
    const headers = await betterAuthComponent.getHeaders(ctx);
    const baUsers = await auth.api.listUsers({ query: {}, headers });

    const users = await Promise.all(
      baUsers.users.map(async (baUser) => {
        // @ts-expect-error: userId exists on baUser
        const user = await ctx.db.get(baUser.userId as Id<"users">);
        if (!user) return null;
        return {
          _id: user._id,
          userId: user._id,
          email: baUser.email,
          role: baUser.role as "admin" | "user",
          _creationTime: user._creationTime,
          updatedAt: baUser.updatedAt as unknown as number,
        };
      })
    );

    return users.filter((u) => !!u);
  },
});

export const updateUserRole = mutation({
  args: { userId: v.string(), role: v.union(v.literal("admin"), v.literal("user")) },
  handler: async (ctx, args) => {
    const profiles = await ctx.db.query("userProfiles").collect();
    const profile = profiles.find((p) => p.userId === args.userId);

    if (!profile) {
      throw new Error("User profile not found");
    }

    // Update Better Auth
    const auth = createAuth(ctx);
    const headers = await betterAuthComponent.getHeaders(ctx);
    await auth.api.setRole({
      body: {
        userId: args.userId,
        role: args.role,
      },
      headers,
    });
  },
});
