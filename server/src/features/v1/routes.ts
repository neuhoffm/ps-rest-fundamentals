import express from "express";
import { itemsRouter } from "./items/items.router";
import { customersRouter } from "./customers/customers.router";
import { ordersRouter } from "./orders/orders.router";
import { validateAccessToken } from "../../middleware/auth0.middleware";

// register routes
export const v1Router = express.Router();

v1Router.use("/items", itemsRouter);

v1Router.use("/customers", validateAccessToken, customersRouter);

v1Router.use("/orders", validateAccessToken, ordersRouter);
