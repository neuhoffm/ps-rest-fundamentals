import express from "express";
import {
  upsertCustomer,
  deleteCustomer,
  getCustomerDetail,
  getCustomers,
  searchCustomers,
} from "./customers.service";
import {
  idUUIDRequestSchema,
  customerDTORequestSchema,
  queryRequestSchema,
} from "../types";
import { validate } from "../../../middleware/validation.middleware";
import { create } from "xmlbuilder2";
import { getOrdersForCustomer } from "../orders/orders.service";
import { checkRequiredPermission } from "../../../middleware/auth0.middleware";
import {
  CustomersPermissions,
  SecurityPermissions,
} from "../../../config/permissions";

export const customersRouter = express.Router();

customersRouter.get(
  "/",
  checkRequiredPermission(CustomersPermissions.Read),
  async (req, res) => {
    /*
      #swagger.summary = "Gets all customers"
      #swagger.responses[200] = {
        description: "The list of customers",
        schema: {$ref: "#components/schemas/customers"}
      }
    */

    const customers = await getCustomers();
    if (req.headers["accept"] == "application/xml") {
      const root = create().ele("customers");
      customers.forEach((i) => {
        root.ele("customer", i);
      });

      res.status(200).send(root.end({ prettyPrint: true }));
    } else {
      res.json(customers);
    }
  }
);

customersRouter.get(
  "/:id",
  checkRequiredPermission(CustomersPermissions.Read_Single),
  validate(idUUIDRequestSchema),
  async (req, res) => {
    /*
      #swagger.summary = "Gets a specific customer by ID"
      #swagger.responses[200] = {
        description: "The customer",
        schema: {$ref: "#components/schemas/customer"}
      }
    */
    const data = idUUIDRequestSchema.parse(req);
    const customer = await getCustomerDetail(data.params.id);
    if (customer != null) {
      if (req.headers["accept"] == "application/xml") {
        res.status(200).send(create().ele("customer", customer).end());
      } else {
        res.json(customer);
      }
    } else {
      res.status(404).json({ message: "Customer Not Found" });
    }
  }
);

customersRouter.get(
  "/:id/orders",
  checkRequiredPermission(CustomersPermissions.Read_Customer_Orders),
  validate(idUUIDRequestSchema),
  async (req, res) => {
    /*
      #swagger.summary = "Gets the orders for a customer by customer ID"
      #swagger.responses[200] = {
        description: "The orders",
        schema: {$ref: "#components/schemas/customerOrders"}
      }
    */

    const data = idUUIDRequestSchema.parse(req);
    const orders = await getOrdersForCustomer(data.params.id);
    if (req.headers["accept"] == "application/xml") {
      const root = create().ele("orders");
      orders.forEach((i) => {
        root.ele("order", i);
      });

      res.status(200).send(root.end({ prettyPrint: true }));
    } else {
      res.json(orders);
    }
  }
);

customersRouter.get(
  "/search/:query",
  checkRequiredPermission(CustomersPermissions.Read),
  validate(queryRequestSchema),
  async (req, res) => {
    /*
      #swagger.summary = "Gets customers matching the query"
      #swagger.responses[200] = {
        description: "The list of customers",
        schema: {$ref: "#components/schemas/customers"}
      }
    */
    const data = queryRequestSchema.parse(req);
    const customers = await searchCustomers(data.params.query);
    if (req.headers["accept"] == "application/xml") {
      const root = create().ele("customers");
      customers.forEach((i) => {
        root.ele("customer", i);
      });

      res.status(200).send(root.end({ prettyPrint: true }));
    } else {
      res.json(customers);
    }
  }
);

customersRouter.post(
  "/",
  checkRequiredPermission(CustomersPermissions.Create),
  validate(customerDTORequestSchema),
  async (req, res) => {
    /*
      #swagger.summary = "Creates a new customer"
      #swagger.requestBody = {
        required: true,
        schema: { $ref: "#components/schemas/createCustomerDTO"}
      } 
    */

    const data = customerDTORequestSchema.parse(req);
    const customer = await upsertCustomer(data.body);
    if (customer != null) {
      res.status(201).json(customer);
    } else {
      res.status(500).json({ message: "Creation failed" });
    }
  }
);

customersRouter.delete(
  "/:id",
  checkRequiredPermission(SecurityPermissions.Deny),
  validate(idUUIDRequestSchema),
  async (req, res) => {
    /*
      #swagger.summary = "Deletes a specific customer by ID"
      #swagger.responses[200] = {
        description: "The customer that was deleted",
        schema: {$ref: "#components/schemas/customer"}
      }
    */

    const data = idUUIDRequestSchema.parse(req);
    const customer = await deleteCustomer(data.params.id);
    if (customer != null) {
      res.json(customer);
    } else {
      res.status(404).json({ message: "Customer Not Found" });
    }
  }
);

customersRouter.put(
  "/",
  checkRequiredPermission(CustomersPermissions.Write),
  validate(customerDTORequestSchema),
  async (req, res) => {
    /*
      #swagger.summary = "Updates a customer"
      #swagger.requestBody = {
        required: true,
        schema: { $ref: "#components/schemas/updateCustomerDTO"}
      } 
    */

    const data = customerDTORequestSchema.parse(req);
    const customer = await upsertCustomer(data.body);
    if (customer != null) {
      res.json(customer);
    } else {
      res.status(404).json({ message: "Customer Not Found" });
    }
  }
);
