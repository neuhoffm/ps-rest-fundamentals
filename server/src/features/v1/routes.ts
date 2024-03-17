import express from "express";
import { itemsRouter } from "./items/items.router";
import { customersRouter } from "./customers/customers.router";
import { ordersRouter } from "./orders/orders.router";
import { validateAccessToken } from "../../middleware/auth0.middleware";

// register routes
export const v1Router = express.Router();

v1Router.use(
  "/items",
  itemsRouter
  //    #swagger.tags = ['Items']
);

v1Router.use(
  "/customers",
  validateAccessToken,
  customersRouter
  //    #swagger.tags = ['Customers']
  //    #swagger.security = [{bearerAuth:[]}]
);

v1Router.use(
  "/orders",
  validateAccessToken,
  ordersRouter
  //    #swagger.tags = ['Orders']
  //    #swagger.security = [{bearerAuth:[]}]
);
