import { z } from "zod";

export type Item = {
  id: number;
  name: string;
  imageUrl: string;
  description?: string | undefined | null;
};

export const itemDTO = z.object({
  id: z.coerce.number(),
  name: z.string(),
  description: z.optional(z.nullable(z.string())),
  imageUrl: z.string().url(),
});

export type ItemDTO = z.infer<typeof itemDTO>;
