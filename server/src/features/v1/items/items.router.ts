import express from "express";
import {
  upsertItem,
  deleteItem,
  getItemDetail,
  getItems,
} from "./items.service";
import { idNumberRequestSchema, itemDTORequestSchema } from "../types";
import { validate } from "../../../middleware/validation.middleware";
import { create } from "xmlbuilder2";
import {
  ItemsPermissions,
  SecurityPermissions,
} from "../../../config/permissions";
import {
  checkRequiredPermission,
  validateAccessToken,
} from "../../../middleware/auth0.middleware";

export const itemsRouter = express.Router();

itemsRouter.get("/", async (req, res) => {
  /*
    #swagger.summary = "Gets all items"
    #swagger.responses[200] = {
      description: "The list of items",
      schema: {$ref: "#components/schemas/items"}
    }
  */
  const items = await getItems();
  items.forEach((item) => {
    item.imageUrl = buildImageUrl(req, item.id);
  });

  if (req.headers["accept"] == "application/xml") {
    const root = create().ele("items");
    items.forEach((i) => {
      root.ele("item", i);
    });

    res.status(200).send(root.end({ prettyPrint: true }));
  } else {
    res.json(items);
  }
});

itemsRouter.get("/:id", validate(idNumberRequestSchema), async (req, res) => {
  /*
    #swagger.summary = "Gets a specific item by ID"
    #swagger.responses[200] = {
      description: "The item",
      schema: {$ref: "#components/schemas/itemDetailed"}
    }
  */
  const data = idNumberRequestSchema.parse(req);
  const item = await getItemDetail(data.params.id);
  if (item != null) {
    item.staffReview = "This is a great product!";
    item.imageUrl = buildImageUrl(req, item.id);
    if (req.headers["accept"] == "application/xml") {
      res.status(200).send(create().ele("item", item).end());
    } else {
      res.json(item);
    }
  } else {
    res.status(404).json({ message: "Item Not Found" });
  }
});

itemsRouter.post(
  "/",
  validateAccessToken,
  checkRequiredPermission(ItemsPermissions.Write),
  validate(itemDTORequestSchema),
  async (req, res) => {
    /*
      #swagger.summary = "Creates a new item"
      #swagger.requestBody = {
        required: true,
        schema: { $ref: "#components/schemas/itemDTO"}
      }
      #swagger.security = [{bearerAuth:[]}] 
    */

    const data = itemDTORequestSchema.parse(req);
    const item = await upsertItem(data.body);
    if (item != null) {
      res.status(201).json(item);
    } else {
      res.status(500).json({ message: "Creation failed" });
    }
  }
);

itemsRouter.delete(
  "/:id",
  validateAccessToken,
  checkRequiredPermission(SecurityPermissions.Deny),
  validate(idNumberRequestSchema),
  async (req, res) => {
    /*
      #swagger.summary = "Deletes a specific item by ID"
      #swagger.responses[200] = {
        description: "The item that was deleted",
        schema: {$ref: "#components/schemas/item"}
      }
      #swagger.security = [{bearerAuth:[]}]
    */

    const data = idNumberRequestSchema.parse(req);
    const item = await deleteItem(data.params.id);
    if (item != null) {
      res.json(item);
    } else {
      res.status(404).json({ message: "Item Not Found" });
    }
  }
);

itemsRouter.put(
  "/",
  validateAccessToken,
  checkRequiredPermission(ItemsPermissions.Write),
  validate(itemDTORequestSchema),
  async (req, res) => {
    /*
    #swagger.summary = "Updates an item"
    #swagger.requestBody = {
      required: true,
      schema: { $ref: "#components/schemas/updateItemDTO"}
    } 
    #swagger.security = [{bearerAuth:[]}]
    */

    const data = itemDTORequestSchema.parse(req);
    const item = await upsertItem(data.body);
    if (item != null) {
      res.json(item);
    } else {
      res.status(404).json({ message: "Item Not Found" });
    }
  }
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildImageUrl(req: any, id: number): string {
  return `${req.protocol}://${req.get("host")}/images/${id}.jpg`;
}
