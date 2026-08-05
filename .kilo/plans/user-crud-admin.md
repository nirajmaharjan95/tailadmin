# Admin User CRUD (`/users`)

## Goal

Add a full CRUD screen for application users, visible and usable by `admin` only, mirroring the existing Employee feature structure on both backend and frontend.

The Sidebar already has the `Users` entry (`/users`, `viewby: "admin"`) — no Sidebar change is needed. The `users` table already exists (`backend/seeds/auth.ts`) with `id, first_name, last_name, email, password_hash, role, status, created_at`. No schema migration is required.

## Decisions (confirmed)

1. **Hard delete.** `DELETE /api/users/:id` removes the row; `refresh_tokens.user_id` has `ON DELETE CASCADE`, so sessions are cleaned up automatically.
2. **Editable `role` and `status`.** Admin can edit `firstName`, `lastName`, `email`, `role`, `status`.
3. **Self-protection.** An admin cannot delete themselves, nor change their own `role` or `status` (prevents locking the last admin out). Enforced server-side (`req.user.id`), with the Delete button hidden for the current user in the UI.
4. **Route-level admin guard.** New `AdminRoute` wrapper redirects non-admins away from `/users`. Backend still enforces `requireRole("admin")` — the UI guard is UX only (spec §29: "hiding a button is not authorization").
5. **Password handling.** Required on create (bcrypt-hashed server-side via the existing `hashPassword`). **Not** editable from this screen — password changes stay in the existing self-service `POST /api/auth/change-password` flow. Keeps scope minimal and avoids an admin-password-reset flow that was not requested.
6. **Error envelope.** Use the structured `{ error: { code, message } }` envelope (`ApiError` / `sendApiError`) rather than the legacy `{ error: "string" }` shape used by `employee.controller.ts`. Reason: `frontend/src/api/client.ts:21` reads `body.error.message`, so only the structured envelope surfaces real messages (e.g. "An account with this email already exists.") in toasts. This matches the newer auth module.

---

## Backend

### 1. `backend/src/utils/api-error.ts` (modify)

Add `"NOT_FOUND"` and `"CONFLICT"` to the `ApiErrorCode` union. Additive only — no existing behavior changes.

### 2. `backend/src/types/user.types.ts` (new)

```ts
import { UserRole, UserStatus } from "./auth.types.js";

// User shape returned by the admin user endpoints. Never includes password_hash.
export interface AdminUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}
```

Reuses `UserRole` / `UserStatus` / `UserRecord` from `auth.types.ts` — do not redeclare them.

### 3. `backend/src/validations/user.validation.ts` (new)

Mirror `auth.validation.ts` conventions (trim, lowercase email, explicit messages):

```ts
export const roleEnum = z.enum(["user", "admin"]);
export const statusEnum = z.enum(["ACTIVE", "DISABLED", "LOCKED"]);

export const createUserSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100),
  lastName: z.string().trim().min(1, "Last name is required").max(100),
  email: z.string().trim().toLowerCase().email("Invalid email address").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
  role: roleEnum,
  status: statusEnum,
});

export const updateUserSchema = createUserSchema.omit({ password: true });

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
```

### 4. `backend/src/repositories/user.repository.ts` (extend, do not rewrite)

Keep `findByEmail`, `findById`, `updatePasswordHash`, `insert` exactly as they are (used by `auth.service.ts`). Add:

- `findAll(limit: number, offset: number, pattern: string)` — `SELECT id, first_name, last_name, email, role, COALESCE(status,'ACTIVE') AS status, created_at FROM users WHERE first_name ILIKE $3 OR last_name ILIKE $3 OR email ILIKE $3 ORDER BY id DESC LIMIT $1 OFFSET $2`. **Never select `password_hash` here** — this row shape flows to the API.
- `countAll(pattern: string)` — matching `COUNT(*)` with the same `WHERE`.
- `update(id, input: UpdateUserInput): Promise<UserRecord | null>` — `UPDATE users SET first_name=$1, last_name=$2, email=$3, role=$4, status=$5 WHERE id=$6 RETURNING ...`.
- `remove(id: number): Promise<boolean>` — `DELETE FROM users WHERE id=$1 RETURNING id`.

All parameterized (AGENTS.md §16). Same `pool.query` style as `employee.repository.ts`.

### 5. `backend/src/services/user.service.ts` (new)

Shape mirrors `employee.service.ts`, but throws `ApiError` for business rules:

- `getAllUsers(limit, offset, search)` → `{ data: AdminUser[]; total: number }`, using `Promise.all([findAll, countAll])` and a local `toAdminUser(row)` mapper (snake_case row → camelCase API shape).
- `getUserById(id)` → `AdminUser`; throws `ApiError(404, "NOT_FOUND", "User not found.")`.
- `createUser(input)`:
  - `findByEmail` → if taken, `ApiError(409, "EMAIL_TAKEN", "An account with this email already exists.")`.
  - `userRepository.insert({ ...input, passwordHash: await hashPassword(input.password) })`.
  - Note: current `insert` does not set `status`; either extend it with an optional `status` (defaulting to `'ACTIVE'` so `auth.service.register` is unaffected) or follow the insert with the `update`. **Prefer extending `insert` with an optional `status`** — one round-trip, no behavior change for register.
- `updateUser(id, input, actorId)`:
  - Load current row (`findById`); 404 if missing.
  - If `actorId === id` and (`input.role !== current.role` || `input.status !== current.status`) → `ApiError(403, "FORBIDDEN", "You cannot change your own role or status.")`.
  - Email uniqueness: `findByEmail(input.email)` → conflict only if the found row's `id !== id` → 409 `EMAIL_TAKEN`.
  - Apply update. If `role` or `status` changed, call `refreshTokenRepository.revokeAllForUser(id)`. **Why:** the role is a JWT claim (`jwt.util.ts`), so a demotion or disable would otherwise remain effective until the current access token expires. Revoking refresh tokens forces re-authentication.
- `deleteUser(id, actorId)`:
  - If `actorId === id` → `ApiError(403, "FORBIDDEN", "You cannot delete your own account.")`.
  - `remove(id)`; if false → 404.

### 6. `backend/src/controllers/user.controller.ts` (new)

Same layer responsibilities as `employee.controller.ts` (parse query/params, `safeParse` the body, delegate, translate errors) but using the structured envelope:

- Validation failure → `sendError(res, 400, "VALIDATION_ERROR", "Validation failed.", parseErrors(parsed.error.issues))` (reuses the existing `parseErrors` helper and the `details` parameter that `sendError` already supports).
- Any thrown error → `sendApiError(res, error)` (maps `ApiError`, otherwise 500 `INTERNAL_ERROR`).
- Exports: `getAll`, `getById`, `create`, `update`, `remove`.
- `create` responds `201`; others `200`.
- Pass `req.user!.id` as `actorId` into `updateUser` / `deleteUser`. `requireAuth` guarantees `req.user`.

### 7. `backend/src/routes/user.routes.ts` (new)

```ts
const router = express.Router();

router.use(requireAuth);
router.use(requireRole("admin"));

router.get("/", userController.getAll);
router.get("/:id", userController.getById);
router.post("/", userController.create);
router.put("/:id", userController.update);
router.delete("/:id", userController.remove);
```

Router-level `requireRole` so no endpoint can be added later without authorization by accident.

### 8. `backend/src/server.ts` (modify)

Add `import userRouter from "./routes/user.routes.js";` and `app.use("/api/users", userRouter);` next to the other feature routers. Note the path does not collide with `/api/auth/*`.

---

## Frontend

### 9. `frontend/src/features/user/types/user.types.ts` (new)

```ts
import { UserRole } from "@/features/authentication/types/auth.types";

export type UserStatus = "ACTIVE" | "DISABLED" | "LOCKED";

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}
```

Reuses `UserRole` from the auth feature. Note the deliberate deviation from `IEmployee`: **no `actions` field** — the actions column is declared with `columnHelper.display({ id: "actions" })` instead of polluting the domain type with a UI concern. Also no optional `id`, since a listed user always has one.

### 10. `frontend/src/features/user/schemas/user.schema.ts` (new)

Mirrors `employee.schema.ts` (react-hook-form + zod, string-based fields):

```ts
export const userSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string(),
  role: z.enum(["user", "admin"]),
  status: z.enum(["ACTIVE", "DISABLED", "LOCKED"]),
});
```

Password is conditionally required (create only). Implement with a `superRefine`/`refine` driven by an `isEditing` flag, i.e. export a `buildUserSchema(isEditing: boolean)` factory, or a discriminated pair `createUserSchema` / `editUserSchema` where the edit schema omits `password`. **Prefer two schemas** (`createUserSchema`, `editUserSchema`) — simpler and keeps the type honest about which fields exist.

### 11. `frontend/src/features/user/api/user.service.ts` (new)

Thin typed wrappers over `@/api/client`, mirroring `employee.service.ts`:

```ts
getUsers(params?: { limit?; offset?; search? }) => get<{ data: IUser[]; total: number }>("/users", params)
createUser(body: CreateUserPayload) => post<IUser>("/users", body)
updateUser(id: number, body: UpdateUserPayload) => put<IUser>(`/users/${id}`, body)
deleteUser(id: number) => del<{ message: string }>(`/users/${id}`)
```

Declare `CreateUserPayload` / `UpdateUserPayload` interfaces in the service (or `user.types.ts`) rather than repeating inline object literals as `employee.service.ts` does — same intent, less duplication.

### 12. `frontend/src/features/user/hooks/useUsers.ts` (new)

Direct mirror of `useEmployees.ts`, renamed (`users`, `selectedUser`, `handleDeleteConfirm` calling `deleteUser`). Keeps the same conventions: URL-driven `page` / `pageSize` / `search` via `useSearchParams`, `useDebounce(search, 1000)`, `refreshTrigger` for post-save reload, `ModalType` from `@/types/types`, `onSuccess` / `onError` toasts.

Two small fixes worth carrying over rather than copying the bug: in `useEmployees.ts:26-45` the `try/finally` wraps the *synchronous* call, so `setIsLoading(false)` runs before the fetch resolves and fetch rejections are unhandled. In `useUsers.ts`, put `try/catch/finally` **inside** the async function so the loading state and `onError` are correct.

### 13. `frontend/src/features/user/components/AddUserModal.tsx` (new)

Mirrors `AddEmployeeModal.tsx`: `react-hook-form` + `zodResolver`, same `inputClass` / `errorClass` Tailwind tokens, same 2-column grid, same "Save Changes" submit button, `onSuccess` / `onError` toasts, `onClose()` on success.

- Props: `{ onClose: () => void; selectedUser: IUser | null }`.
- Fields: First Name, Last Name, Email, Password (create only), Role (`<select>`: User / Admin), Status (`<select>`: Active / Disabled / Locked).
- Role and Status selects are disabled when editing yourself (compare against `useAuth().user?.id`), with helper text explaining why — matches the server-side 403.
- Heading: `Add User` / `Edit User` (the Employee modal's hardcoded "Personal Information" heading is not reused).
- Labels use `htmlFor` + input `id` so they are properly associated (AGENTS.md §18).

### 14. `frontend/src/features/user/components/TableColumns.tsx` (new)

Same factory signature style as the employee columns:

```ts
const TableColumns = (
  onEdit: (user: IUser) => void,
  onDelete: (user: IUser) => void,
  currentUserId?: number
) => [...]
```

Columns: Name (first + last, with email as the secondary line, same markup as the employee Name cell), Role, Status, Created At (`formatDate`), and a `display` actions column.

- The page is admin-only, so the actions column is always present (no `isAdmin` flag needed here); the **Delete** button is hidden when `row.original.id === currentUserId`.
- Role/Status rendered as small badges reusing existing color tokens (`brand`, `success`/`error`) so the screen matches the design system; no new component unless one already exists — check `components/ui/` for a badge first and reuse it if present.

### 15. `frontend/src/pages/Users.tsx` (new)

Structural copy of `pages/Employees.tsx`: same outer card markup, `CustomBreadcrumb` (which derives "Users" from the path automatically), search input with the `LuSearch` button, `ExportDownloadButton` (`filename="users"`, `excludeFields={["id"]}`), `Add New User` button with `MdAdd`, `Table` with pagination props, and the two `Modal`s (add/edit keyed by `selectedUser?.id ?? "new"`, plus delete confirm).

No `useIsAdmin()` gate inside the page is needed for the buttons because `AdminRoute` already guarantees the visitor is an admin; `useAuth()` is still used to get `currentUserId` for the self-delete guard.

### 16. `frontend/src/components/routes/RouteGuard.tsx` (modify) + `AdminRoute.tsx` (new)

Extend `RouteGuard` with an optional `requiresAdmin?: boolean`. After the existing `loading` / auth checks, add:

```tsx
if (requiresAdmin && user?.role !== "admin") {
  return <Navigate to="/dashboard" replace />;
}
```

`user` comes from the same `useAuth()` call already in the component. Existing `ProtectedRoute` / `PublicRoute` behavior is unchanged (the flag defaults to `undefined`).

`AdminRoute.tsx` mirrors `ProtectedRoute.tsx`:

```tsx
const AdminRoute = ({ children }: AdminRouteProps) => (
  <RouteGuard requiresAuth requiresAdmin>{children}</RouteGuard>
);
```

### 17. `frontend/src/App.tsx` (modify)

Inside the existing `LayoutWrapper` route group, after `/employees`:

```tsx
<Route path="/users" element={<AdminRoute><Users /></AdminRoute>} />
```

### 18. `frontend/src/components/DeleteConfirmModal.tsx` (modify)

Add an optional `user?: IUser` prop alongside `employee` / `product`, following the existing pattern: `Delete {user && "User"}` in the heading and `{user && `${user.firstName} ${user.lastName}`}` in the body. Purely additive — existing call sites are untouched.

> Note: this component's prop-per-entity pattern does not scale (a `title`/`name` prop would be better), but refactoring it would touch the Employee and Product pages. Out of scope per AGENTS.md §22.

### 19. Sidebar

**No change.** `frontend/src/components/Sidebar.tsx:27-32` already declares the `Users` item with `viewby: "admin"` and filters it out for non-admins.

---

## Files touched

**New (backend):** `types/user.types.ts`, `validations/user.validation.ts`, `services/user.service.ts`, `controllers/user.controller.ts`, `routes/user.routes.ts`
**Modified (backend):** `repositories/user.repository.ts` (add functions + optional `status` on `insert`), `utils/api-error.ts` (add codes), `server.ts` (register router)

**New (frontend):** `features/user/{types,schemas,api,hooks,components}/…` (6 files), `pages/Users.tsx`, `components/routes/AdminRoute.tsx`
**Modified (frontend):** `App.tsx`, `components/routes/RouteGuard.tsx`, `components/DeleteConfirmModal.tsx`

## Risks / notes

- **ESM imports:** backend is `"type": "module"` — every relative import needs an explicit `.js` extension.
- **`password_hash` leakage:** the new `findAll` / `update` / `findById`-derived responses must go through `toAdminUser`. Never return a raw `UserRecord` from a controller.
- **First admin:** there is still no way to create the initial admin through the app (`auth.service.register` hardcodes `role: "user"`). The first admin must be promoted with a one-off `UPDATE users SET role='admin' WHERE email=…`. After that, admins can create admins from this screen. Worth calling out in the summary.
- **`backend/dist/`** is stale build output — do not edit.
- **Legacy error envelope divergence:** the user endpoints will return `{ error: { code, message } }` while employee/product/task endpoints return `{ error: "string" }`. Intentional (see Decisions §6); normalizing the older controllers is out of scope.

## Verification

Backend (from `backend/`):

1. `npx tsc --noEmit` — must PASS
2. `npm run lint` — must PASS
3. Manual smoke with `npm run dev`:
   - `GET /api/users` without a token → 401
   - `GET /api/users` with a **user**-role token → 403
   - `GET /api/users?limit=5&search=…` with an **admin** token → paginated `{ data, total }`, no `password_hash` in the payload
   - `POST` duplicate email → 409; `PUT` own role change → 403; `DELETE` self → 403

Frontend (from `frontend/`):

4. `npx tsc -b --noEmit` — must PASS (note: `npm run build` runs `tsc -b && vite build`)
5. `npm run lint` — must PASS
6. Manual: as admin → sidebar shows Users, `/users` lists/creates/edits/deletes; as normal user → sidebar hides Users and navigating to `/users` redirects to `/dashboard`. Verify loading, error, and empty states in the table.

No test framework is configured in either workspace (`backend` `npm test` is a stub), so automated tests will be reported as NOT RUN.

## Out of scope

- Admin password reset / force-change flow
- Role or status filter dropdowns, bulk actions, user detail page
- Soft delete, audit logging, `updated_at` / `last_login_at` columns
- Permission granularity beyond the existing `user` / `admin` roles
- Normalizing the legacy error envelope in employee/product/task/course/cart controllers
- Refactoring `DeleteConfirmModal` to a generic API
