# OAuthButtons — Full OAuth Integration Plan

## Context

The `OAuthButtons` component currently renders Google and X (Twitter) buttons with `console.log` placeholders. The app uses **Clerk v5** (`@clerk/clerk-react` ^5.61.8) for authentication. Clerk provides `authenticateWithRedirect` for OAuth flows — no custom callback route is needed since `ClerkProvider` wraps the entire app in `main.tsx`.

The component is shared between Sign In (`/signin`) and Sign Up (`/signup`) pages. Button labels must be context-sensitive ("Sign in" vs "Sign up").

## Changes

### 1. Create `frontend/src/features/authentication/hooks/useOAuth.ts`

New custom hook that wraps Clerk's redirect-based OAuth:

- Import `useSignIn` and `useSignUp` from `@clerk/clerk-react`
- Import `onError` from `@/utils/toast` for error handling
- Expose four functions:
  - `signInWithGoogle()` → `signIn.authenticateWithRedirect({ strategy: "oauth_google", redirectUrl, redirectUrlComplete })`
  - `signInWithX()` → `signIn.authenticateWithRedirect({ strategy: "oauth_x", redirectUrl, redirectUrlComplete })`
  - `signUpWithGoogle()` → `signUp.authenticateWithRedirect({ strategy: "oauth_google", redirectUrl, redirectUrlComplete })`
  - `signUpWithX()` → `signUp.authenticateWithRedirect({ strategy: "oauth_x", redirectUrl, redirectUrlComplete })`
- `redirectUrl` = current page URL (`/signin` or `/signup`)
- `redirectUrlComplete` = `"/employees"` (same post-auth destination used by email/password forms)
- Each function wrapped in try/catch with `onError` toast on failure
- Follow existing hook conventions (`useSigninForm.ts` pattern)

### 2. Update `frontend/src/features/authentication/components/OAuthButtons.tsx`

- Rename `interface OAuthButtons` → `interface OAuthButtonsProps`
- Add `variant: "signin" | "signup"` prop (no default — callers must be explicit)
- Rename callback props from `onGoogleSignup`/`onXTwitterSignup` → `onGoogleAuth`/`onXTwitterAuth`
- Use `variant` to set button labels: `"Sign in with Google"` / `"Sign up with Google"` etc.
- Preserve all existing Tailwind classes and layout

### 3. Update `frontend/src/pages/Signin.tsx`

- Import and use `useOAuth` hook
- Pass `signInWithGoogle` and `signInWithX` as `onGoogleAuth` and `onXTwitterAuth`
- Add `variant="signin"` to `<OAuthButtons>`

### 4. Update `frontend/src/pages/Signup.tsx`

- Import and use `useOAuth` hook
- Pass `signUpWithGoogle` and `signUpWithX` as `onGoogleAuth` and `onXTwitterAuth`
- Add `variant="signup"` to `<OAuthButtons>`

## Files Affected

| File | Action |
|------|--------|
| `frontend/src/features/authentication/hooks/useOAuth.ts` | **Create** — Clerk OAuth redirect hook |
| `frontend/src/features/authentication/components/OAuthButtons.tsx` | **Edit** — variant prop, rename interface, rename callbacks, dynamic labels |
| `frontend/src/pages/Signin.tsx` | **Edit** — use hook, pass callbacks, add variant |
| `frontend/src/pages/Signup.tsx` | **Edit** — use hook, pass callbacks, add variant |

## Clerk Dashboard Prerequisites

For OAuth to work at runtime, Google and X (Twitter) OAuth applications must be configured in the Clerk Dashboard under **User & Authentication → Social Connections**. This is a configuration prerequisite, not a code change.

## Verification

1. `tsc --noEmit` — type-check passes
2. `npm run lint` — no lint errors
3. Manual: Sign In page buttons show "Sign in with Google/X" and trigger Clerk OAuth redirect
4. Manual: Sign Up page buttons show "Sign up with Google/X" and trigger Clerk OAuth redirect
5. After OAuth callback, user lands on `/employees` with an active session
