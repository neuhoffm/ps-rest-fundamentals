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
import { validate } from "../../middleware/validation.middleware";
import { getOrdersForCustomer } from "../orders/orders.service";

export const customersRouter = express.Router();

customersRouter.get("/", async (req, res) => {
  const customers = await getCustomers();
  res.json(customers);
});

customersRouter.get("/:id", validate(idUUIDRequestSchema), async (req, res) => {
  const data = idUUIDRequestSchema.parse(req);
  const customer = await getCustomerDetail(data.params.id);
  if (customer != null) {
    res.json(customer);
  } else {
    res.status(404).json({ message: "Customer Not Found" });
  }
});

customersRouter.get(
  "/:id/orders",
  validate(idUUIDRequestSchema),
  async (req, res) => {
    const data = idUUIDRequestSchema.parse(req);
    const orders = await getOrdersForCustomer(data.params.id);
    res.json(orders);
  }
);

customersRouter.get(
  "/search/:query",
  validate(queryRequestSchema),
  async (req, res) => {
    const data = queryRequestSchema.parse(req);
    const customers = await searchCustomers(data.params.query);

    res.json(customers);
  }
);

customersRouter.post(
  "/",
  validate(customerDTORequestSchema),
  async (req, res) => {
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
  validate(idUUIDRequestSchema),
  async (req, res) => {
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
  validate(customerDTORequestSchema),
  async (req, res) => {
    const data = customerDTORequestSchema.parse(req);
    const customer = await upsertCustomer(data.body);
    if (customer != null) {
      res.json(customer);
    } else {
      res.status(404).json({ message: "Customer Not Found" });
    }
  }
);
