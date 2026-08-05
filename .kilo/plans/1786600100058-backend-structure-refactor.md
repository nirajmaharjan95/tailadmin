# Backend Folder Structure Refactor (Keep Layers, Clean Up)

## Goal

Behavior-preserving refactor of `backend/src`. Keep the layered layout (routes/controllers/services), but:

1. Normalize file naming to dot-notation (`taskRoutes.ts` → `task.routes.ts`).
2. Add a `repositories/` layer so SQL lives in repositories, not services (AGENTS.md §16).
3. Split each `*.model.ts` into `*.types.ts` (interfaces/consts) and `*.validation.ts` (zod schemas).
4. Deduplicate the `parseErrors` helper (currently copy-pasted in 3 controllers).

No API contract, logic, or dependency changes. No changes to `frontend/`. Seeds are self-contained (import only `pg`/`dotenv`) — leave `backend/seeds/` untouched.

## Target structure

```
backend/src/
  server.ts
  config/db.ts                      (unchanged)
  middleware/auth.middleware.ts     (renamed from auth.ts)
  routes/<domain>.routes.ts         (renamed: employeeRoutes.ts → employee.routes.ts, etc.)
  controllers/<domain>.controller.ts (unchanged names)
  services/<domain>.service.ts       (SQL removed, delegates to repository)
  repositories/<domain>.repository.ts (new: all pool.query calls)
  types/<domain>.types.ts            (from models: interfaces, STATUS/TAGS consts, type aliases)
  validations/<domain>.validation.ts (from models: zod schemas + z.infer input types)
  utils/parse-errors.ts              (shared parseErrors)
```

Domains: `employee`, `product`, `task`, `course`, `cart`.

## Tasks (ordered)

1. **Create `src/utils/parse-errors.ts`** — export the `parseErrors` function currently duplicated in `employee.controller.ts`, `product.controller.ts`, `task.controller.ts` (identical implementations; verify before extracting). Update those 3 controllers to import it.

2. **Split models per domain** (5 files → 10):
   - `models/task.model.ts` → `types/task.types.ts` (`STATUS`, `TAGS`, `TASK_TAGS`, `TASK_STATUS`, `Task`) + `validations/task.validation.ts` (`taskStatusEnum`, `taskTagEnum`, `taskSchema`, `TaskInput`).
   - Note: `Task extends TaskInput`, so `task.types.ts` imports `TaskInput` from `task.validation.ts` — keep the extends relationship; do not redeclare fields.
   - Repeat the same split for employee, product, course, cart (inspect each model file; put zod schemas + inferred input types in `validations/`, plain interfaces/consts in `types/`).
   - Delete `models/` when empty.
   - Update all imports in controllers/services (remember `.js` ESM suffixes, e.g. `../types/task.types.js`).

3. **Add repositories** (5 new files): move every `pool.query` call from `services/<domain>.service.ts` into `repositories/<domain>.repository.ts` with same function signatures. Services keep orchestration (e.g. `Promise.all` count aggregation in `task.service.ts` may move wholesale if the service would become a pure pass-through — prefer moving raw queries only and keeping result-shaping in the service). Repositories are the only files importing `config/db.js`.

4. **Rename route files**: `employeeRoutes.ts` → `employee.routes.ts`, same for product/task/course/cart. Use `git mv` to preserve history.

5. **Rename middleware**: `middleware/auth.ts` → `middleware/auth.middleware.ts`. Update import in `server.ts` and any route files importing `protect` (check `cartRoutes.ts` — cart routes are user-scoped and likely use `protect`).

6. **Update `server.ts`** imports; also rename the un-descriptive `router` import for employees to `employeeRouter`.

## Constraints / risks

- ESM project (`"type": "module"`): all relative imports need explicit `.js` extensions — easy to miss on new files.
- `backend/dist/` is stale build output; do not edit. A fresh `npm run build` validates it.
- Do not change route paths, response shapes, validation rules, SQL text, or error messages.
- Do not touch `frontend/` — it talks to the API over HTTP only.

## Validation

From `backend/`:

1. `npx tsc --noEmit` (or `npm run build`) — PASS required.
2. `npm run lint` — PASS required.
3. Smoke test: `npm run dev`, then hit `GET /api/tasks`, `GET /api/products`, `GET /api/courses`, `GET /api/employees` (public) and confirm `GET /api/cart` returns 401 without a token.
4. No tests exist (`npm test` is a stub) — mention NOT RUN in summary.

## Out of scope

- Feature-module restructuring, new dependencies, DB/schema changes, seed refactor, frontend changes, adding tests.
