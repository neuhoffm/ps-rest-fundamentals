import express from "express";
import {
  upsertItem,
  deleteItem,
  getItemDetail,
  getItems,
} from "./items.service";
import { idNumberRequestSchema, itemDTORequestSchema } from "../types";
import { validate } from "../../middleware/validation.middleware";

export const itemsRouter = express.Router();

itemsRouter.get("/", async (req, res) => {
  const items = await getItems();
  items.forEach((item) => {
    item.imageUrl = buildImageUrl(req, item.id);
  });

  res.json(items);
});

itemsRouter.get("/:id", validate(idNumberRequestSchema), async (req, res) => {
  const data = idNumberRequestSchema.parse(req);
  const item = await getItemDetail(data.params.id);
  if (item != null) {
    item.imageUrl = buildImageUrl(req, item.id);
    res.json(item);
  } else {
    res.status(404).json({ message: "Item Not Found" });
  }
});

itemsRouter.post("/", validate(itemDTORequestSchema), async (req, res) => {
  const data = itemDTORequestSchema.parse(req);
  const item = await upsertItem(data.body);
  if (item != null) {
    res.status(201).json(item);
  } else {
    res.status(500).json({ message: "Creation failed" });
  }
});

itemsRouter.delete(
  "/:id",
  validate(idNumberRequestSchema),
  async (req, res) => {
    const data = idNumberRequestSchema.parse(req);
    const item = await deleteItem(data.params.id);
    if (item != null) {
      res.json(item);
    } else {
      res.status(404).json({ message: "Item Not Found" });
    }
  }
);

itemsRouter.put("/", validate(itemDTORequestSchema), async (req, res) => {
  const data = itemDTORequestSchema.parse(req);
  const item = await upsertItem(data.body);
  if (item != null) {
    res.json(item);
  } else {
    res.status(404).json({ message: "Item Not Found" });
  }
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildImageUrl(req: any, id: number): string {
  return `${req.protocol}://${req.get("host")}/images/${id}.jpg`;
}
