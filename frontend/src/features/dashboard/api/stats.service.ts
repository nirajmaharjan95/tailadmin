import { get } from "../../../api/client";
import { DashboardStats } from "../types/dashboard.types";

// Mounted as `app.use("/api", statsRouter)` on the backend, so the path is
// `/stats` relative to API_BASE_URL. The response shape is role-dependent:
// admins get `users`, everyone else gets `courses`.
export const getStats = () => get<DashboardStats>("/stats");