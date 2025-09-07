import express, { urlencoded } from "express";
import authRoutes from "./routes/auth.route.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(urlencoded({ extended: true, limit: "16kb" }));

app.use("/api/v1/auth", authRoutes);

app.use(errorMiddleware);

export { app };
