import express from "express";
import {
  upsertOrder,
  deleteOrder,
  getOrderDetail,
  getOrders,
  deleteOrderItem,
  addOrderItem,
} from "./orders.service";
import {
  idItemIdUUIDRequestSchema,
  idUUIDRequestSchema,
  orderDTORequestSchema,
  orderItemsDTORequestSchema,
  pagingRequestSchema,
} from "../types";
import { validate } from "../../middleware/validation.middleware";
import {
  OrdersPermissions,
  SecurityPermissions,
} from "../../config/permissions";
import {
  checkRequiredPermission,
  validateAccessToken,
} from "../../middleware/auth0.middleware";

export const ordersRouter = express.Router();

ordersRouter.get(
  "/",
  validateAccessToken,
  checkRequiredPermission(OrdersPermissions.Read),
  validate(pagingRequestSchema),
  async (req, res) => {
    const data = pagingRequestSchema.parse(req);
    const orders = await getOrders(data.query.start, data.query.size);

    res.json(orders);
  }
);

ordersRouter.get(
  "/:id",
  validateAccessToken,
  checkRequiredPermission(OrdersPermissions.Read_Single),
  validate(idUUIDRequestSchema),
  async (req, res) => {
    /*
    #swagger.summary = "Gets a specific order by ID"
    #swagger.responses[200] = {
      description: "The order",
      schema: {$ref: "#components/schemas/order"}
    }
  */
    const data = idUUIDRequestSchema.parse(req);
    const order = await getOrderDetail(data.params.id);
    if (order != null) {
      res.json(order);
    } else {
      res.status(404).json({ message: "Order Not Found" });
    }
  }
);

ordersRouter.post(
  "/",
  validateAccessToken,
  checkRequiredPermission(OrdersPermissions.Create),
  validate(orderDTORequestSchema),
  async (req, res) => {
    /*
    #swagger.summary = "Creates a new order"
    #swagger.requestBody = {
      required: true,
      schema: { $ref: "#components/schemas/orderDTO"}
    } 
  */
    const data = orderDTORequestSchema.parse(req);
    const order = await upsertOrder(data.body);
    if (order != null) {
      res.status(201).json(order);
    } else {
      res.status(500).json({ message: "Creation failed" });
    }
  }
);

ordersRouter.delete(
  "/:id",
  validateAccessToken,
  checkRequiredPermission(SecurityPermissions.Deny),
  validate(idUUIDRequestSchema),
  async (req, res) => {
    /*
    #swagger.summary = "Deletes a specific order by ID"
    #swagger.responses[200] = {
      description: "The order that was deleted",
      schema: {$ref: "#components/schemas/order"}
    }
  */
    const data = idUUIDRequestSchema.parse(req);
    const order = await deleteOrder(data.params.id);
    if (order != null) {
      res.json(order);
    } else {
      res.status(404).json({ message: "Order Not Found" });
    }
  }
);

ordersRouter.put(
  "/",
  validateAccessToken,
  checkRequiredPermission(OrdersPermissions.Write),
  validate(orderDTORequestSchema),
  async (req, res) => {
    /*
  #swagger.summary = "Updates an order's status"
  #swagger.requestBody = {
    required: true,
    schema: { $ref: "#components/schemas/updateOrderDTO"}
  } 
  */
    const data = orderDTORequestSchema.parse(req);
    const order = await upsertOrder(data.body);
    if (order != null) {
      res.json(order);
    } else {
      res.status(404).json({ message: "Order Not Found" });
    }
  }
);

ordersRouter.delete(
  "/:id/items/:itemId",
  validateAccessToken,
  checkRequiredPermission(OrdersPermissions.Create),
  validate(idItemIdUUIDRequestSchema),
  async (req, res) => {
    /*
    #swagger.summary = "Deletes a specific item from an order by order and item ID"
    #swagger.responses[200] = {
      description: "The order after the item is deleted",
      schema: {$ref: "#components/schemas/order"}
    }
  */
    const data = idItemIdUUIDRequestSchema.parse(req);
    const order = await deleteOrderItem(data.params.id, data.params.itemId);
    if (order != null) {
      res.json(order);
    } else {
      res.status(404).json({ message: "Order or Item Not Found" });
    }
  }
);

ordersRouter.post(
  "/:id/items",
  validateAccessToken,
  checkRequiredPermission(OrdersPermissions.Create),
  validate(orderItemsDTORequestSchema),
  async (req, res) => {
    /*
    #swagger.summary = "Adds items to an order"
    #swagger.requestBody = {
      required: true,
      schema: { $ref: "#components/schemas/orderItemsDTO"}
    } 
  */
    const data = orderItemsDTORequestSchema.parse(req);
    const promises = data.body.map((item) => {
      return addOrderItem(data.params.id, item.itemId, item.quantity);
    });
    const order = await Promise.all(promises).then(() =>
      getOrderDetail(data.params.id)
    );

    if (order != null) {
      res.status(201).json(order);
    } else {
      res.status(500).json({ message: "Addition failed" });
    }
  }
);
