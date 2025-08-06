# Admin User Management & Session Impersonation POC

A minimal proof of concept for a Next.js application with Convex backend and Better Auth for user management and session impersonation.

## Implementation Plan

### Phase 1: Foundation Setup

- [x] Set up Convex project and configure client
- [x] Configure Better Auth with Convex adapter (basic setup)
- [x] Set up authentication providers (email/password)
- [x] Create basic project structure and TypeScript types

### Phase 2: User Authentication & Profile Management

- [x] Create sign-up/sign-in forms
- [x] Implement user profile storage in Convex (triggered by Better Auth user creation)
- [x] Set up protected routes and auth middleware
- [x] Create basic user profile management

### Phase 3: Admin Role & User Management

- [x] Configure admin role in Better Auth
- [x] Create admin-only dashboard
- [x] Build user list view for admins
- [x] Implement basic user management (view, edit, delete)

### Phase 4: Session Impersonation (Better Auth Admin Plugin)

- [x] Integrate Better Auth Admin plugin for session impersonation
- [x] Create admin interface to select users to impersonate
- [x] Build impersonation controls (start/stop) using official plugin
- [x] Add visual indicators for impersonated sessions
- [x] Configure admin plugin with proper settings and security

### Phase 5: UI Polish & Final Features

- [ ] Improve responsive design and styling
- [ ] Add loading states and error handling
- [ ] Create simple user activity display
- [ ] Final testing and bug fixes

## Key Technical Notes

- **Better Auth Integration**: Use Better Auth for all user roles, sessions, and impersonation
- **Admin Plugin**: Leverage the official Better Auth Admin plugin for robust impersonation
- **Convex Storage**: Only store user profile data, let Better Auth handle core user data
- **Admin Access**: Simple role-based access using Better Auth's built-in role system
- **Session Management**: Leverage Better Auth's session impersonation capabilities via admin plugin
- **Minimal Scope**: Focus on core functionality without audit trails or bulk operations

## Dependencies

- Next.js 15.4.5
- Convex 1.25.4
- Better Auth 1.3.4
- @convex-dev/better-auth 0.7.13
- Tailwind CSS 4
- TypeScript 5
