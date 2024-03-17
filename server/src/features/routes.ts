import express from "express";
import { itemsRouter } from "./items/items.router";
import { customersRouter } from "./customers/customers.router";
import { ordersRouter } from "./orders/orders.router";
import { validateAccessToken } from "../middleware/auth0.middleware";

// register routes
const apiRouter = express.Router();

apiRouter.use("/items", itemsRouter);

apiRouter.use("/customers", validateAccessToken, customersRouter);

apiRouter.use("/orders", validateAccessToken, ordersRouter);

export const routes = express.Router();
routes.use("/api", apiRouter);
routes.get("/", (req, res) => {
  res.status(200).send("<h1>Server is ready!</h1>");
});
