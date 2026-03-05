import express, { type Application } from "express";
import apiRouter from "./router";

const app: Application = express();

// use JSON for req.body
app.use(express.json());

// health check endpoint
app.get("/api/health", (_, res) => {
  res.status(200).json({ status: "ok" });
});

// use the router to answers request on /api
app.use("/api", apiRouter);

// return HTTP 404 if the request has not been handled
app.use((_, res) => {
  res.status(404).send();
});

export default app;
