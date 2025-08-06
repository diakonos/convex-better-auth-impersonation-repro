# Convex + Better Auth Impersonation Issue

When impersonating a user via the [Better Auth Admin plugin](https://www.better-auth.com/docs/plugins/admin#impersonate-user), Better Auth apis throw errors.

Example:

```ts
// query - userProfiles:getUserProfile
const auth = createAuth(ctx);
const headers = await betterAuthComponent.getHeaders(ctx);
const session = await auth.api.getSession({ headers });
console.log("getUserProfile session:", session);
```

When logged in normally, this logs a session as expected. However, when impersonating another user, it gives the following:

```
6/8/2025, 6:10:15 pm [CONVEX Q(userProfiles:getUserProfile)] [ERROR] '\x1B[2m2025-08-06T10:10:15.741Z\x1B[0m \x1B[31mERROR\x1B[0m \x1B[1m[Better Auth]:\x1B[0m INTERNAL_SERVER_ERROR' [Error: ctx is not a mutation ctx]
6/8/2025, 6:10:15 pm [CONVEX Q(userProfiles:getUserProfile)] [LOG] 'getUserProfile session:' null
```

## Run locally

1. Clone this repo, install dependencies, and setup ENV varaibles:

- `NEXT_PUBLIC_CONVEX_URL` in `.env` file.
- `BETTER_AUTH_SECRET` in Convex.

2. Start the dev server for both Convex and Next.js.

## Steps to reproduce:

1. Create a new account by signing up, and manually set this user's role as admin in the Convex backend (in the betterAuth component).

   (note the logged session information)

2. Create a different account with the default role.
3. Using the admin account, go to the admin dashboard and click "Impersonate" on the normal user account.

   (note the logged session information)
