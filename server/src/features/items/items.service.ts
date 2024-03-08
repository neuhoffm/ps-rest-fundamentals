import { PrismaClient } from "@prisma/client";
import { Item, ItemDTO, ItemDetail } from "../types";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

export function getItems(): Promise<Item[]> {
  return prisma.item.findMany({
    select: {
      id: true,
      name: true,
    },
  });
}

export function getItemDetail(itemId: number): Promise<ItemDetail | null> {
  return prisma.item.findFirst({
    where: { id: itemId },
  });
}

export function upsertItem(item: ItemDTO): Promise<Item | null> {
  return prisma.item.upsert({
    where: {
      id: item.id || -1,
    },
    update: {
      name: item.name,
      description: item.description,
    },
    create: {
      name: item.name,
      description: item.description,
    },
  });
}

export function deleteItem(itemId: number): Promise<Item | null> {
  return prisma.item
    .delete({
      where: { id: itemId },
    })
    .catch((error) => {
      if (
        error instanceof PrismaClientKnownRequestError &&
        (error as PrismaClientKnownRequestError).code == "P2025"
      ) {
        return Promise.resolve(null);
      } else {
        throw error;
      }
    });
}
