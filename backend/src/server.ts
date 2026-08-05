import cors from "cors";
import "dotenv/config";
import express from "express";
import { corsOrigins } from "./config/env.js";
import authRouter from "./routes/auth.routes.js";
import cartRouter from "./routes/cart.routes.js";
import courseRouter from "./routes/course.routes.js";
import statsRouter from "./routes/stats.routes.js";
import employeeRouter from "./routes/employee.routes.js";
import productRouter from "./routes/product.routes.js";
import taskRouter from "./routes/task.routes.js";
import userRouter from "./routes/user.routes.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
// Explicit origin allowlist (spec §21); credentials enabled for the
// HttpOnly refresh-token cookie.
app.use(cors({ origin: corsOrigins, credentials: true }));
app.set("etag", false);
app.use((_req, res, next) => {
  res.set("Cache-Control", "no-store");
  res.set("X-Content-Type-Options", "nosniff");
  res.set("Referrer-Policy", "no-referrer");
  res.set("X-Frame-Options", "DENY");
  next();
});

app.use("/api/auth", authRouter);

app.use("/api/users", userRouter);
app.use("/api/employees", employeeRouter);
app.use("/api/products", productRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/courses", courseRouter);
app.use("/api/cart", cartRouter);
app.use("/api", statsRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
