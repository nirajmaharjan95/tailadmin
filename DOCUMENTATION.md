# Tailadmin — Project Documentation

A full-stack admin dashboard built with **React 19 + Vite** (frontend) and **Express 5** (backend), featuring authentication, CRUD management, dark mode, and a responsive sidebar.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Frontend Features](#frontend-features)
  - [Sidebar Toggle with Local Storage Persistence](#sidebar-toggle-with-local-storage-persistence)
  - [Dark / Light Theme with Local Storage Persistence](#dark--light-theme-with-local-storage-persistence)
  - [Authentication (Clerk)](#authentication-clerk)
  - [Route Guards](#route-guards)
  - [Admin Role Guard](#admin-role-guard)
  - [CRUD: Employees (Local State)](#crud-employees-local-state)
  - [CRUD: Products (React Query)](#crud-products-react-query)
  - [Server-Side Search & Pagination](#server-side-search--pagination)
  - [Generic Table Component](#generic-table-component)
  - [Modal System](#modal-system)
  - [Toast Notifications](#toast-notifications)
  - [UI Component Library (shadcn/ui)](#ui-component-library-shadcnui)
  - [Notification Dropdown](#notification-dropdown)
  - [User Profile Dropdown](#user-profile-dropdown)
  - [Responsive Design](#responsive-design)
- [Backend Features](#backend-features)
  - [RESTful API](#restful-api)
  - [Zod Request Validation](#zod-request-validation)
  - [PostgreSQL with Raw SQL](#postgresql-with-raw-sql)
  - [Seed Scripts](#seed-scripts)
- [State Management Strategy](#state-management-strategy)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19, TypeScript 5 |
| Build | Vite 6 |
| Routing | react-router-dom 7 |
| Client State | React Context API |
| Server State | TanStack React Query 5 |
| CSS | Tailwind CSS 4 |
| UI Kit | shadcn/ui (Radix primitives) |
| Icons | lucide-react, react-icons |
| Forms | react-hook-form + Zod |
| Tables | TanStack React Table 8 |
| Auth | Clerk |
| Backend | Express 5, TypeScript |
| Database | PostgreSQL (raw SQL via `pg`) |
| Seed Data | @faker-js/faker |

---

## Architecture Overview

```
Browser
  └─ ClerkProvider          (auth context)
       └─ ThemeProvider     (dark/light state)
            └─ QueryClientProvider  (React Query cache)
                 └─ BrowserRouter
                      └─ SidebarProvider
                           └─ Layout
                                ├─ Sidebar
                                ├─ Header (toggle, search, theme, profile)
                                └─ <Outlet /> (page content)
```

The backend is a standalone Express server exposing a RESTful JSON API.

---

## Frontend Features

### Sidebar Toggle with Local Storage Persistence

**Files:** `frontend/src/context/sidebar/`, `hooks/useSidebar.ts`, `components/Sidebar.tsx`, `components/header/Header.tsx`

The sidebar state survives page reloads by persisting to `localStorage`.

#### How it works

1. **Initialization** — `getInitialSidebarState()` reads `localStorage.getItem("sidebarOpen")`. If no value exists, defaults to `true` (open).
2. **State** — `SidebarProvider` holds a `useState<boolean>` initialized from the above function.
3. **Persistence** — A `useEffect` syncs every change to `localStorage.setItem("sidebarOpen", JSON.stringify(isSidebarOpen))`.
4. **Toggle** — The hamburger button in `Header` calls `toggle()` from context, which flips `isSidebarOpen`.
5. **Close** — `close()` sets state to `false` (used on mobile after navigation).

#### Visual states

| State | Mobile | Desktop (`lg:`) |
|-------|--------|-----------------|
| Open | Slide-in overlay (`translate-x-0`) | Full width (`w-[290px]`) |
| Closed | Hidden off-screen (`-translate-x-full`) | Icon-only collapsed (`w-[72px]`) |

#### Data flow

```
Header hamburger click
  → toggle() (SidebarProvider)
    → setIsSidebarOpen(!prev)
      → Sidebar re-renders
      → useEffect writes to localStorage
      → Next page load reads from localStorage
```

---

### Dark / Light Theme with Local Storage Persistence

**Files:** `frontend/src/context/theme/`, `hooks/useTheme.ts`, `components/ThemeToggle.tsx`

Supports three modes: **light**, **dark**, and **system preference**.

#### How it works

1. **Initialization** — `getInitialTheme()` checks `localStorage.getItem("theme")`:
   - `"dark"` → dark mode
   - `"light"` → light mode
   - `null` → falls back to `window.matchMedia("(prefers-color-scheme: dark)")` (system preference)
2. **DOM** — A `useEffect` adds/removes the `.dark` class on `<html>`, which triggers Tailwind's `dark:` variants.
3. **Persistence** — Every theme change is saved to `localStorage.setItem("theme", theme)`.
4. **Toggle** — `toggleTheme()` cycles through `dark → light → system`.
5. **OS change listening** — A `matchMedia` listener detects system preference changes and updates the theme when in `"system"` mode.

---

### Authentication (Clerk)

**Files:** `frontend/src/features/authentication/`

Uses [Clerk](https://clerk.com) for authentication with email/password and OAuth.

- **Sign In** — Email + password form with Zod validation (`signinSchema`).
- **Sign Up** — First name, last name, email, password (min 8 chars), terms checkbox (`signupSchema`).
- **OAuth** — Google and X/Twitter buttons (UI wired, handlers ready).
- **Session** — Clerk manages JWT/session cookies automatically.
- **User Info** — Accessible via `useUser()` from `@clerk/clerk-react`.

---

### Route Guards

**Files:** `frontend/src/components/routes/`, `App.tsx`

| Guard | Behavior |
|-------|----------|
| `PublicRoute` | If user is signed in → redirect to `/employees` |
| `ProtectedRoute` | If user is not signed in → redirect to `/signin` |
| `RouteGuard` | Waits for Clerk `isLoaded`, then renders children or redirects |

---

### Admin Role Guard

**File:** `frontend/src/hooks/useIsAdmin.ts`

Checks `user.publicMetadata.role === "admin"` from Clerk. Controls visibility of **Add**, **Edit**, and **Delete** buttons on the Employees and Products pages.

---

### CRUD: Employees (Local State)

**Files:** `frontend/src/features/employee/`

Uses **local component state** (`useState`) with **URL search params** for pagination.

- **Create/Update** — `AddEmployeeModal` with react-hook-form + Zod (`employee.schema.ts`).
- **Delete** — `DeleteConfirmModal` with confirmation.
- **Search** — Debounced (1000ms) search via URL `?search=` param.
- **Pagination** — `?page=` and `?pageSize=` URL params.
- **Data Fetch** — Manual `useEffect` + async/await calling `employee.service.ts`.
- **Refresh** — A `refreshTrigger` counter forces re-fetch after mutations.

---

### CRUD: Products (React Query)

**Files:** `frontend/src/features/product/`

Uses **TanStack React Query** for automatic cache management.

- **`useQuery`** — Fetches products with key `["products", pageIndex, pageSize, debouncedSearch]`. Uses `keepPreviousData` for smooth pagination.
- **`useMutation`** — `createProduct`, `updateProduct`, `deleteProduct` each call `queryClient.invalidateQueries({ queryKey: ["products"] })` on success or error.
- **Toast feedback** — Mutations show success/error toasts via `sonner`.
- **Form** — `AddProductModal` with react-hook-form + Zod (`product.schema.ts`).

---

### Server-Side Search & Pagination

Both Employees and Products use server-side search + pagination:

| Query Param | Description |
|-------------|-------------|
| `limit` | Page size (default: 10) |
| `offset` | Row offset (`page * pageSize`) |
| `search` | ILIKE search against name/first_name/last_name |

Backend SQL pattern:
```sql
SELECT * FROM products
WHERE name ILIKE $1
ORDER BY id
LIMIT $2 OFFSET $3
```

---

### Generic Table Component

**File:** `frontend/src/components/Table.tsx`

Built on `@tanstack/react-table`. Features:
- Column definitions passed as props
- Sorting (clickable column headers)
- Skeleton loading state (8 shimmer rows via `Skeleton`)
- "No results" empty state
- Responsive overflow scroll

**Pagination** (`components/Pagination.tsx`):
- Previous / Next buttons
- Page number display
- Page size selector (5, 10, 20, 50)

---

### Modal System

**Files:** `frontend/src/components/Modal.tsx`, `DeleteConfirmModal.tsx`

| Modal | Purpose |
|-------|---------|
| `Modal` | Generic overlay with backdrop, close button, title, children |
| `DeleteConfirmModal` | Confirmation dialog with item name, confirm/cancel buttons |

Usage pattern:
```tsx
const [modal, setModal] = useState<ModalType>(null); // "add" | "edit" | "delete" | null
```

---

### Toast Notifications

**File:** `frontend/src/utils/toast.ts`

Helper functions wrapping `sonner`:
- `onSuccess(msg)` — success toast with checkmark
- `onError(msg)` — error toast with X icon

Used in mutation callbacks to give user feedback on CRUD operations.

---

### UI Component Library (shadcn/ui)

**Files:** `frontend/src/components/ui/`

| Component | Based On |
|-----------|----------|
| `button.tsx` | Radix Slot + CVA variants |
| `input.tsx` | Native input with styling |
| `badge.tsx` | CVA variants (default, secondary, outline, destructive) |
| `label.tsx` | Radix Label |
| `checkbox.tsx` | Radix Checkbox |
| `skeleton.tsx` | CSS animation placeholder |
| `separator.tsx` | Radix Separator |
| `field.tsx` | Complex form field wrapper |
| `toast.tsx` | Sonner Toaster wrapper |

All use `cn()` (`clsx` + `tailwind-merge`) for class composition.

---

### Notification Dropdown

**Files:** `frontend/src/components/header/NotificationDropdown.tsx`, `constants/notificationList.ts`

- Mock notification data (8 items) with icons, titles, descriptions, timestamps.
- Dropdown opens on bell icon click.
- Closes when clicking outside (`useOutsideClick` hook).
- Shows count badge on bell icon.

---

### User Profile Dropdown

**File:** `frontend/src/components/header/Profile.tsx`

- Displays Clerk user avatar + name.
- Dropdown with links: View Profile, Account Settings, Support, Sign Out.
- Sign Out redirects to `/signin` via Clerk's `signOut({ redirectUrl: "/signin" })`.

---

### Responsive Design

| Breakpoint | Sidebar | Layout |
|------------|---------|--------|
| Mobile (< `lg`) | Off-canvas overlay (toggle to show) | Single column |
| Desktop (`lg:`) | Fixed inline sidebar | Sidebar + main content |

All pages use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`).

---

## Backend Features

### RESTful API

| Endpoint | Methods |
|----------|---------|
| `/api/employees` | `GET`, `POST` |
| `/api/employees/:id` | `GET`, `PUT`, `DELETE` |
| `/api/products` | `GET`, `POST` |
| `/api/products/:id` | `GET`, `PUT`, `DELETE` |

**Path:** `backend/src/routes/`

### Zod Request Validation

**Files:** `backend/src/models/`

Each model defines a Zod schema used to validate request bodies on `POST` and `PUT` endpoints. Schemas mirror the frontend validation rules.

### PostgreSQL with Raw SQL

**File:** `backend/src/config/db.ts`

Uses `pg` (native `Pool`) with raw SQL queries:
- Parameterized queries (no SQL injection)
- ILIKE for case-insensitive search
- LIMIT/OFFSET for pagination
- `COUNT(*)` for total row count

### Seed Scripts

**Files:** `backend/seeds/`

| Script | Records |
|--------|---------|
| `employee.ts` | 50 employees (Faker) |
| `product.ts` | 100 products (Faker) |

Run with `npx tsx backend/seeds/employee.ts`.

---

## State Management Strategy

| Type | Approach | Used For |
|------|----------|----------|
| **UI State** | React Context + localStorage | Sidebar open/close, theme |
| **Server State** | TanStack React Query | Products (queries + mutations with cache invalidation) |
| **UI + URL State** | `useState` + `useSearchParams` | Employees (pagination, search in URL) |
| **Form State** | react-hook-form | All add/edit forms |
| **Auth State** | Clerk (external) | User session, role metadata |

---

## Project Structure

```
tailadmin/
├── backend/                    # Express API server
│   ├── seeds/                  # Database seed scripts
│   └── src/
│       ├── server.ts           # Entry point
│       ├── config/db.ts        # PostgreSQL pool
│       ├── models/             # Zod schemas + TS interfaces
│       ├── controllers/        # Request handlers
│       ├── services/           # SQL queries
│       └── routes/             # Express routers
│
├── frontend/                   # React SPA
│   └── src/
│       ├── main.tsx            # Root provider tree
│       ├── App.tsx             # Router + routes
│       ├── Layout.tsx          # Sidebar + Header + Outlet
│       ├── index.css           # Tailwind + theme tokens
│       ├── api/                # HTTP client + auth API
│       ├── context/            # Theme + Sidebar providers
│       ├── hooks/              # Shared hooks
│       ├── components/         # Shared UI components
│       │   ├── header/         # Header, Profile, NotificationDropdown
│       │   ├── routes/         # Route guards
│       │   └── ui/             # shadcn/ui primitives
│       ├── features/           # Feature modules
│       │   ├── authentication/ # Signin/Signup forms
│       │   ├── employee/       # Employee CRUD
│       │   └── product/        # Product CRUD
│       ├── pages/              # Route page components
│       ├── constants/          # Mock data
│       ├── types/              # Shared TS types
│       └── utils/              # Formatting + toast helpers
│
├── DOCUMENTATION.md
└── README.md
```

---

## Environment Variables

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable API key |

### Backend (`backend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `4000` | API server port |
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_USER` | `postgres` | PostgreSQL user |
| `DB_PASSWORD` | `postgres` | PostgreSQL password |
| `DB_NAME` | `tailadmin` | PostgreSQL database name |
| `DB_PORT` | `5433` | PostgreSQL port |
