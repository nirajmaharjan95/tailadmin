# Plan: Change Password Feature

## Decision (confirmed with user)

Logged-in user changes their password with `{ currentPassword, newPassword }`. On success:
- All refresh tokens for the user are revoked (`revokeAllForUser` — already exists)
- A **fresh session is issued for the current device** (new refresh cookie + new access token), so the user stays signed in here while every other device/browser is logged out (spec §24.7)
- Forgot-password (emailed reset token) is **out of scope** — deferred until an email provider exists

## Backend

### 1. `backend/src/validations/auth.validation.ts`
Add:
```ts
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters"),
});
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
```
(Same bounds as `registerSchema` for consistency.)

### 2. `backend/src/repositories/user.repository.ts`
Add:
```ts
export const updatePasswordHash = async (id: number, passwordHash: string): Promise<void> => {
  await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [passwordHash, id]);
};
```

### 3. `backend/src/services/auth.service.ts`
Add `changePassword(userId: number, input: ChangePasswordInput): Promise<AuthSession>`:
1. `userRepository.findById(userId)` → if missing or `status !== "ACTIVE"` throw `ApiError(401, "UNAUTHORIZED", ...)`
2. `verifyPassword(input.currentPassword, user.password_hash)` → if false throw `ApiError(400, "INVALID_CREDENTIALS", "Current password is incorrect.")`
   (Specific message is safe here — the caller is already authenticated; no enumeration risk.)
3. `updatePasswordHash(user.id, await hashPassword(input.newPassword))`
4. `refreshTokenRepository.revokeAllForUser(user.id)` — logs out all other sessions
5. `return issueSession(user)` — fresh refresh token + access token for this device

Order matters: revoke **after** the hash update, `issueSession` **after** the revoke so the new token survives.

### 4. `backend/src/controllers/auth.controller.ts`
Add `changePassword` handler following the existing pattern:
- Parse with `changePasswordSchema` → 400 `VALIDATION_ERROR` + `parseErrors` details
- Guard `req.user` (401) — same as `me`
- `respondWithSession(res, await authService.changePassword(req.user.id, parsed.data), 200)` — reuses the existing helper that sets the refresh cookie and returns `{ user, accessToken }`
- `catch` → `sendApiError`

### 5. `backend/src/routes/auth.routes.ts`
```ts
router.post("/change-password", loginRateLimit, requireAuth, authController.changePassword);
```
Rate-limited because it accepts password guesses; behind `requireAuth`.

## Frontend

### 6. `frontend/src/features/authentication/schema/changePasswordSchema.ts` (new)
```ts
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine(d => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
```

### 7. `frontend/src/features/authentication/api/auth.service.ts`
Add `changePassword(accessToken, input): Promise<AuthSession>` using the same raw-fetch pattern as the other auth calls (must NOT go through the shared client's 401→refresh→retry loop, and needs `credentials: "include"` for the rotated refresh cookie):
- `POST /auth/change-password` with `Authorization: Bearer <accessToken>`, JSON body `{ currentPassword, newPassword }`
- Error parsing via the existing `parseError` helper

### 8. `frontend/src/features/authentication/context/AuthContext.ts` + `AuthProvider.tsx`
- Add `changePassword: (input: { currentPassword: string; newPassword: string }) => Promise<void>` to `AuthContextType`
- Implementation: read current token via `getAuthToken()`, call `authApi.changePassword`, then `applySession(session)` so the new access token replaces the old (now-revoked-family) one

### 9. UI — `frontend/src/features/authentication/components/ChangePasswordModal.tsx` (new) + hook `useChangePasswordForm.ts` (new)
- Hook mirrors `useSigninForm`: RHF + zodResolver, `isLoading`, per-field show/hide password toggles, `onSubmit` calls `useAuth().changePassword`, `onSuccess("Password changed successfully")` / `onError`, resets + closes on success
- Modal uses existing `Input`, `Label`, `Button` components and existing modal/dialog styling conventions (check `components/ui` for an existing dialog primitive before writing one)
- Wire it to the currently dead **"Account settings"** item in `frontend/src/components/header/Profile.tsx` (replace `href="chat.html"` anchor with a button that opens the modal)

## Verification

1. `backend`: `npx tsc --noEmit`, `npm run lint`, `npm run build`
2. `frontend`: `npx tsc -b`, `npm run lint`, `npm run build`
3. Live smoke test (dev server + curl):
   - register/login → change password with wrong current password → 400 `INVALID_CREDENTIALS`
   - change with correct current password → 200, new cookie set, response has new `accessToken`
   - old refresh cookie → `POST /auth/refresh` → 401 (revoked)
   - new cookie → refresh works; login with old password → 401; new password → 200
   - short `newPassword` → 400 `VALIDATION_ERROR`
4. Manual UI check: open modal from Profile → Account settings, change password, confirm toast + still signed in
