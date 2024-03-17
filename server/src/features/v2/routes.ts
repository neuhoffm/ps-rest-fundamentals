import express from "express";
import { customersRouter } from "../v1/customers/customers.router";
import { ordersRouter } from "../v1/orders/orders.router";
import { itemsRouterV2 } from "./items/items.routerV2";
import { validateAccessToken } from "../../middleware/auth0.middleware";

// register routes
export const v2Router = express.Router();

v2Router.use("/items", itemsRouterV2);

v2Router.use("/customers", validateAccessToken, customersRouter);

v2Router.use("/orders", validateAccessToken, ordersRouter);
