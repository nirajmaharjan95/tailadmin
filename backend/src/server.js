import express from "express";
import "dotenv/config";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());
app.set("etag", false);
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

import router from "./routes/employeeRoutes.js";
app.use("/api/employees", router);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
