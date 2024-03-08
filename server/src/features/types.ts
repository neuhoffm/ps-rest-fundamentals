import { z } from "zod";

export const idNumberRequestSchema = z.object({
  params: z.object({ id: z.coerce.number() }),
});

export const idUUIDRequestSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

export type Item = {
  id: number;
  name: string;
  imageUrl?: string;
  staffReview?: string;
};

export type ItemDetail = Item & {
  description: string | null;
};

export const itemDTO = z.object({
  id: z.optional(z.coerce.number()),
  name: z.string(),
  description: z.nullable(z.string()),
});

export type ItemDTO = z.infer<typeof itemDTO>;

export const itemDTORequestSchema = z.object({
  body: itemDTO,
});

export const queryRequestSchema = z.object({
  params: z.object({ query: z.string() }),
});

export type Customer = {
  id: string;
  name: string;
  email: string;
};

export const customerDTO = z.object({
  id: z.optional(z.string()),
  name: z.string(),
  email: z.string().email(),
});

export type CustomerDTO = z.infer<typeof customerDTO>;

export const customerDTORequestSchema = z.object({
  body: customerDTO,
});

export type BasicOrder = {
  id: string;
  status: string;
  createdAt: Date;
};

export type Order = BasicOrder & {
  customer: Customer;
};

export type OrderDetail = Order & {
  items: OrderItem[];
};

export type OrderItem = {
  orderId: string;
  item: Item;
  quantity: number;
};

export const orderItemDTO = z.object({
  itemId: z.number(),
  quantity: z.number(),
});

export const orderDTO = z.object({
  id: z.optional(z.string().uuid()),
  customerId: z.string().uuid(),
  status: z.optional(z.string()),
});

export const pagingRequestSchema = z.object({
  query: z.object({ start: z.coerce.number(), size: z.coerce.number() }),
});

export const orderDTORequestSchema = z.object({
  body: orderDTO,
});

export const orderItemsDTORequestSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.array(orderItemDTO),
});

export type OrderDTO = z.infer<typeof orderDTO>;

export type orderItemDTO = z.infer<typeof orderItemDTO>;

export const idItemIdUUIDRequestSchema = z.object({
  params: z.object({ id: z.string().uuid(), itemId: z.coerce.number() }),
});
