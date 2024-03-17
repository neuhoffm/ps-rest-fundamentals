import express from "express";
import { itemsRouter } from "./items/items.router";
import { customersRouter } from "./customers/customers.router";
import { ordersRouter } from "./orders/orders.router";

// register routes
export const v1Router = express.Router();

v1Router.use("/items", itemsRouter);

v1Router.use("/customers", customersRouter);

v1Router.use("/orders", ordersRouter);
