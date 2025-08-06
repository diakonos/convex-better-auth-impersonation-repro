import { convexAdapter } from "@convex-dev/better-auth";
import { convex, crossDomain } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { betterAuthComponent } from "../../convex/auth";
import { type GenericCtx } from "../../convex/_generated/server";

// You'll want to replace this with an environment variable
const siteUrl = process.env.VERCEL_URL ?? "http://localhost:3000";

export const createAuth = (ctx: GenericCtx) =>
  // Configure your Better Auth instance here
  betterAuth({
    trustedOrigins: [siteUrl],
    database: convexAdapter(ctx, betterAuthComponent),

    // Simple non-verified email/password to get started
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    plugins: [
      // The Convex plugin is required
      convex(),

      // The cross domain plugin is required for client side frameworks
      // crossDomain({
      //   siteUrl,
      // }),

      nextCookies(),

      // Add the admin plugin for impersonation and user management
      admin({
        defaultRole: "user",
        adminRoles: ["admin"],
        impersonationSessionDuration: 60 * 60, // 1 hour
      }),
    ],
  });
