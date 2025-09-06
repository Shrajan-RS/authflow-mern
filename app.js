import express, { urlencoded } from "express";
import { router as userRoute } from "./routes/auth.route.js";

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(urlencoded({ extended: true, limit: "16kb" }));

app.use("/api/v1/users", userRoute);

export { app };
