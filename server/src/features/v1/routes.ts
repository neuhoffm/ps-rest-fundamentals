import express from "express";
import { itemsRouter } from "./items/items.router";
import { customersRouter } from "./customers/customers.router";
import { ordersRouter } from "./orders/orders.router";

// register routes
export const v1Router = express.Router();

v1Router.use(
  "/items",
  itemsRouter
  //    #swagger.tags = ['Items']
);

v1Router.use(
  "/customers",
  customersRouter
  //    #swagger.tags = ['Customers']
  //    #swagger.security = [{bearerAuth:[]}]
);

v1Router.use(
  "/orders",
  ordersRouter
  //    #swagger.tags = ['Orders']
  //    #swagger.security = [{bearerAuth:[]}]
);
