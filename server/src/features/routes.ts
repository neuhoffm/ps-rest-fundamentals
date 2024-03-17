import express from "express";
import { v1Router } from "./v1/routes";

// register routes
const apiRouter = express.Router();

apiRouter.use("/v1", v1Router);
export const routes = express.Router();
routes.use("/api", apiRouter);
routes.get("/", (req, res) => {
  res.status(200).send("<h1>Server is ready!</h1>");
});
