# Dashboard Stats Component — Implementation Plan

Scope: the **stats cards row only** (`Dashboard.tsx:15-20`, `54-79`, `223-244`). Issues/Progress/To-do/Activity/Projects sections are **out of scope** and must remain untouched.

## Context & Key Finding

The current stat cards are fabricated. `Dashboard.tsx` hardcodes **Projects / Members / Invoices / Refunds**, but the backend has **no `project`, `invoice`, or `refund` table and no stats endpoint**. The DB is raw SQL over `pg` (no ORM; schema lives in `backend/seeds/*.ts`) and only contains: `users`, `employee`, `product`, `task`, `course`, `cart_items`, `refresh_tokens`.

Making the stats "functional" therefore requires a **new backend aggregation endpoint**, not just wiring a hook.

## Decisions (agreed)

| Decision | Choice |
| --- | --- |
| Metrics | Employees, Users, Products, Tasks |
| Role gating | One endpoint, `requireAuth` only; `users` metric omitted from payload for non-admins |
| Frontend data layer | React Query + skeleton + inline retry |
| Aggregation | New `countStats()` per existing domain repository, combined via `Promise.all` in a dashboard service |
| Endpoint granularity | **One aggregate endpoint**, not four per-count endpoints (see rationale below) |

### Why one aggregate endpoint, not four count endpoints

The four counts render as a single visual unit. Four endpoints would mean four round trips, four JWT verifications, four React Query cache entries and four independent loading states — cards popping in one at a time with layout shift. `Promise.all` runs the four `COUNT` queries concurrently against the shared pool (`config/db.ts`, default max 10 connections); four counts over ~100-row tables is negligible. One endpoint also means one query key to invalidate, one retry affordance, one error surface.

Splitting is only justified once a count is consumed independently elsewhere (e.g. a sidebar task badge). No such consumer exists. The per-domain `countStats()` functions remain reusable, so a dedicated route can be added later without rewriting any SQL.

Each card shows a **total** plus a real **sub-metric** used as the caption.

---

## Backend Tasks

### 1. `backend/src/types/dashboard.types.ts` (new)

```ts
export interface StatBucket { total: number; secondary: number; }

export interface DashboardStats {
  employees: StatBucket;  // secondary = hired this year
  products: StatBucket;   // secondary = low stock
  tasks: StatBucket;      // secondary = completed
  users?: StatBucket;     // admin only; secondary = active
}
```

### 2. Repository additions — **add new functions, do not modify existing ones**

`countAll(pattern)` already exists in `employee`, `product`, and `user` repositories and is used by the list endpoints. It takes a search pattern and must **not** be changed. Add a separate `countStats()` to each. Use `COUNT(*)::int` (plain `COUNT(*)` returns a **string** in `pg` — `task.repository.ts` already casts, `employee`/`product`/`user` do not).

- `employee.repository.ts` → `countStats()`
  ```sql
  SELECT COUNT(*)::int AS total,
         COUNT(*) FILTER (WHERE start_date >= date_trunc('year', CURRENT_DATE))::int AS secondary
  FROM employee
  ```
  **Blocker — verify the column type first.** There is no `CREATE TABLE employee` anywhere in the repo (`backend/seeds/employee.ts` only `TRUNCATE`s and inserts; the other seeds do create their tables). The table is created out-of-band, so `start_date`'s real type cannot be confirmed from source. Run `\d employee` (or `SELECT data_type FROM information_schema.columns WHERE table_name='employee' AND column_name='start_date'`) before writing this query:
  - `date` / `timestamp` → the query above is correct.
  - `varchar`/`text` → the comparison raises a Postgres type error. Use `start_date::date >= date_trunc('year', CURRENT_DATE)::date`, and note the cast fails on any malformed row.

  Note `employee.validation.ts` accepts `start_date` as a `YYYY-MM-DD` **string**, while the seed inserts a JS `Date` — consistent with a real `date` column plus driver coercion, but confirm rather than assume.
- `product.repository.ts` → `countStats()` (define `const LOW_STOCK_THRESHOLD = 10` in the repository)
  ```sql
  SELECT COUNT(*)::int AS total,
         COUNT(*) FILTER (WHERE stock <= $1)::int AS secondary
  FROM product
  ```
- `task.repository.ts` → `countStats()` — parameterize with `STATUS.COMPLETED` from `types/task.types.ts`, do not inline the literal `'Completed'`
  ```sql
  SELECT COUNT(*)::int AS total,
         COUNT(*) FILTER (WHERE status = $1)::int AS secondary
  FROM task
  ```
- `user.repository.ts` → `countStats()` — mirror the existing `COALESCE(status, 'ACTIVE')` handling used by `SAFE_USER_COLUMNS`
  ```sql
  SELECT COUNT(*)::int AS total,
         COUNT(*) FILTER (WHERE COALESCE(status, 'ACTIVE') = 'ACTIVE')::int AS secondary
  FROM users
  ```

Each returns a single row; the service reads `result.rows[0]`.

### 3. `backend/src/services/dashboard.service.ts` (new)

Orchestration only, mirroring the `Promise.all` style already in `task.service.ts:6`:

```ts
export const getDashboardStats = async (isAdmin: boolean): Promise<DashboardStats> => {
  const [employees, products, tasks, users] = await Promise.all([
    employeeRepository.countStats(),
    productRepository.countStats(),
    taskRepository.countStats(),
    isAdmin ? userRepository.countStats() : Promise.resolve(null),
  ]);
  // map rows -> StatBucket; spread `users` only when non-null
};
```

The role check is a **boolean argument** — the service must not read `req`.

### 4. `backend/src/controllers/dashboard.controller.ts` (new)

```ts
export const getStats = async (req: Request, res: Response) => {
  try {
    res.json(await dashboardService.getDashboardStats(req.user!.role === "admin"));
  } catch (error) {
    sendApiError(res, error);
  }
};
```

**The role check belongs here, in the controller — never in the service.** The service takes a plain `isAdmin: boolean` and must not receive or read `req`. Passing `req` into the service (e.g. `req.user?.role === 'admin'` evaluated inside `Promise.all`) couples the domain layer to HTTP and breaks the Separation of Concerns the rest of the backend follows.

Use `req.user!` (non-null assertion), **not** `req.user?.`. After `requireAuth` the user is guaranteed present; optional chaining would silently evaluate to `undefined !== "admin"` and downgrade an admin to a non-admin response instead of failing loudly. This matches the existing convention at `user.controller.ts:77` (`req.user!.id`).

Use the `sendApiError` envelope (`utils/api-error.ts`) — the newer convention used by `auth`/`user`, **not** the ad-hoc `{ error: "string" }` style in `employee`/`product`. The frontend `client.ts:21` reads `body.error.message`, so only this envelope surfaces a useful message. No request body, so no zod validation needed.

### 5. `backend/src/routes/dashboard.routes.ts` (new)

```ts
router.use(requireAuth);
router.get("/stats", dashboardController.getStats);
```

No `requireRole` — gating is in the payload shape.

### 6. `backend/src/server.ts`

Add `app.use("/api/dashboard", dashboardRouter);` alongside the existing mounts (after line 36).

---

## Frontend Tasks

New feature folder `frontend/src/features/dashboard/`, matching the `product`/`user` feature layout.

### 7. `features/dashboard/types/dashboard.types.ts`
Mirror the backend `DashboardStats` / `StatBucket` shape, with `users` optional.

### 8. `features/dashboard/api/dashboard.service.ts`
```ts
import { get } from "@/api/client";
export const getDashboardStats = () => get<DashboardStats>("/dashboard/stats");
```

### 9. `features/dashboard/hooks/useDashboardStats.ts`
```ts
useQuery({
  queryKey: ["dashboard", "stats"],
  queryFn: getDashboardStats,
  staleTime: 60_000,
});
```
Return `{ stats, isLoading, isError, refetch }`. Follows the `useProducts.ts:30` React Query pattern. **No `onError` toast** — the error is rendered inline, and a toast on every dashboard visit would be noisy.

**Cache-leak fix (required, not optional).** The app creates `new QueryClient()` in `main.tsx:11` and **never clears it** — there is no `queryClient.clear()` / `removeQueries` anywhere in the auth feature. Because this payload is role-shaped and cached for 60s, an admin signing out followed by a non-admin signing in **in the same tab** would be served the cached admin payload, exposing the `users` count.

Scope the cache to the identity instead of relying on a sign-out hook:

```ts
const { user } = useAuth();
useQuery({
  queryKey: ["dashboard", "stats", user?.id],
  ...
});
```

A different signed-in user gets a different key, so a stale payload can never be reused across identities. This is self-contained in the dashboard feature and does not require touching `AuthProvider`. (Calling `queryClient.clear()` on sign-out is the broader correct fix and would also help `products`, but it is a cross-cutting change and stays out of scope here.)

### 10. `features/dashboard/components/StatCard.tsx`
Purely presentational. Props: `label`, `value`, `caption`, `icon`, `to`. Reuses the existing card markup and `cardClass` from `Dashboard.tsx:205-206`; wrap in react-router `Link` so each card navigates to its page. Move `cardClass` into a shared constant the dashboard feature can import rather than duplicating the string.

### 11. `features/dashboard/components/StatCardSkeleton.tsx`
Uses the existing `@/components/ui/skeleton` `Skeleton`, sized to match `StatCard` so the grid does not shift on load.

### 12. `features/dashboard/components/DashboardStats.tsx` (container)
Owns the grid and the three render states:

- **loading** → 4 `StatCardSkeleton` in the same grid
- **error** → one card spanning the grid with a message and a **Retry** `Button` calling `refetch()`
- **success** → build the card view-models and map to `StatCard`

Card mapping (icon/label/caption/route live here, not in the API layer):

| Metric | Icon (`lucide-react`) | Caption | Route |
| --- | --- | --- | --- |
| Employees | `Users` | `{secondary} hired this year` | `/employees` |
| Users (admin) | `UserCog` | `{secondary} active` | `/users` |
| Products | `Package` | `{secondary} low stock` | `/products` |
| Tasks | `ClipboardList` | `{secondary} completed` | `/tasks` |

The Users card renders **only when `stats.users` is present**. Do not use `useIsAdmin()` to decide this — the payload is the single source of truth, which keeps UI and authorization from drifting. Grid stays `grid-cols-1 sm:grid-cols-2 xl:grid-cols-4`; non-admins simply see 3 cards.

### 13. `pages/Dashboard.tsx` edits
- Delete the `Stat` interface (15-20), the `stats` array (54-79), and the stats grid block (223-244).
- Render `<DashboardStats />` in place of the deleted grid.
- Remove the now-unused icon imports `BookOpen`, `ReceiptText`, `RefreshCcw`; keep `Users`/`ClipboardList` only if still referenced elsewhere in the file (`ClipboardList` is still used by the Activity section at line 407). Unused imports will fail `eslint`.
- Everything below the stats row is unchanged.

---

## Risks / Known Bugs To Avoid

Ordered by severity. The first three are defects this plan would otherwise have shipped.

1. **Role cache leak (high).** `QueryClient` is never cleared on sign-out. Mitigated by keying the query on `user?.id` (task 9). Without it, a non-admin can be served an admin's cached `users` count.
2. **`start_date` column type unverified (high, blocks task 2).** No `CREATE TABLE employee` exists in the repo. If the column is textual, the "hired this year" comparison throws at runtime. Verify against the live DB before writing the query.
3. **`req` leaking into the service (medium).** The role decision must be made in the controller and passed as `isAdmin: boolean`. Use `req.user!`, never `req.user?.`, so a missing user fails loudly instead of silently downgrading an admin.
4. **String counts (medium).** Plain `COUNT(*)` returns a *string* in `pg` and would render as `"42"`, and `0` vs `"0"` breaks any falsy check. `task.repository.ts` already casts with `::int`; `employee`/`product`/`user` `countAll` do **not**. Every new query must cast.
5. **Do not modify existing `countAll(pattern)` (medium).** Those are used by the list endpoints and take a search pattern. Add `countStats()` as separate functions; changing the existing signatures breaks pagination totals on four pages.
6. **`COUNT(*) FILTER` requires Postgres 9.4+.** Standard on any supported version, but the fallback is `SUM(CASE WHEN … THEN 1 ELSE 0 END)::int` if the target DB is older.
7. **Sub-metrics are product decisions baked into SQL.** Keep `LOW_STOCK_THRESHOLD` and the "this year" boundary as named constants.
8. **"Hired this year" may legitimately be `0`.** `seeds/employee.ts:79` uses `faker.date.past({ years: 10 })`, which spreads start dates across a decade; only ~10% land in the current year, and a given seed run can produce none. A `0` here is correct output, not a failure. Same for "low stock": `seeds/product.ts:62` seeds `stock` in `0..500`, so only ~2% fall at or below a threshold of 10. (The DDL `DEFAULT 0` at `seeds/product.ts:35` applies only to inserts that omit `stock` — it does **not** make every seeded row low-stock.)
9. **Adding a 5th metric** means touching the type, service, and card map together.

## Validation

0. **Pre-flight:** confirm `employee.start_date`'s column type (risk 2) before writing any SQL.
1. `cd backend && npm run dev`, then with an **admin** token: `GET /api/dashboard/stats` → 200 with `employees`, `products`, `tasks`, `users`.
2. Same call with a **non-admin** token → 200 and **no `users` key**.
3. No token → 401 `{ error: { code: "UNAUTHORIZED" } }`.
4. Inspect the raw JSON: every count must be a **number**, not a quoted string (risk 4).
5. Frontend: load `/dashboard` as admin → 4 cards with real counts; as a regular user → 3 cards, no Users card.
6. **Cache-leak regression:** sign in as admin, load `/dashboard`, sign out, sign in as a non-admin **in the same tab**, load `/dashboard` within 60s → the Users card must **not** appear.
7. Throttle/stop the backend and reload → skeletons then the inline error card; restart backend and click **Retry** → cards populate.
8. Click each card → navigates to the matching page.
9. Cross-check a count against its list page total (e.g. Products card total vs the `/products` table total). Verify sub-metrics against SQL directly, since a legitimate `0` (risk 8) is indistinguishable from a broken filter in the UI.
10. Confirm the four list pages still paginate correctly — proof that `countAll(pattern)` was left untouched (risk 5).
11. `cd backend && npm run lint && npm run build`; `cd frontend && npm run lint && npm run build` (build runs `tsc -b`).

No automated tests: neither workspace has a test runner configured (`backend` `test` script is an `exit 1` stub, frontend has none). Verification is manual.

## Out of Scope

- Issues Discovered, Project Progress, To do, Activity, and Projects table remain hardcoded.
- No new `project`/`invoice`/`refund` tables.
- No caching layer beyond React Query's `staleTime`; no polling.
