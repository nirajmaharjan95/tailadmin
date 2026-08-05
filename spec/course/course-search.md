Course Search — Specification

Goal

Allow users to search and paginate courses efficiently.

User Flow

Search
↓
URL Search Params
↓
TanStack Query
↓
GET /api/courses
↓
Backend
↓
Database
↓
Paginated Results

Requirements

1. Search

- Search by course title.
- Case-insensitive.
- Trim whitespace.
- Debounce input by 300–500ms.
- Empty search shows all courses.
- Search must be performed server-side.

2. Pagination

Use:

page
pageSize

Defaults:

page = 1
pageSize = 20

Maximum pageSize = 100.

Changing the search must reset page to 1.

3. URL State

Search and pagination state must be stored in URL query parameters.

Example:

/courses?search=react&page=1&pageSize=20

Refreshing or sharing the URL must preserve the search state.

4. API

GET /api/courses

Query parameters:

search
page
pageSize

Response:

{
data: Course[];
meta: {
page: number;
pageSize: number;
pageCount: number;
total: number;
};
}

Invalid query parameters return 400.

5. UI States

Implement:

- Loading state
- Results state
- Empty state
- Error state with retry
- Clear/reset search

6. Architecture

Follow Separation of Concerns:

CourseSearch
CourseList
CoursePagination
↓
useCourseSearch
↓
courseApi
↓
Backend

Rules:

- React components handle UI only.
- API communication belongs in courseApi.
- Search state/query orchestration belongs in useCourseSearch.
- TanStack Query manages server state.
- Backend owns search and pagination.
- Use TypeScript and functional React components.
- Do not fetch all courses and filter them in React.

7. Acceptance Criteria

- Search works by title/description.
- Search is debounced.
- Pagination works.
- URL preserves search state.
- Refresh preserves state.
- Empty/error/loading states work.
- Reset returns to default course listing.
- Backend validates query parameters.
- No unnecessary API requests.
- Tests cover search and pagination.

Out of Scope

Do not implement:

- Filters
- Sorting
- AI/semantic search
- Search history
- Saved searches
- Recommendations
- Search suggestions/autocomplete

unless explicitly requested.
