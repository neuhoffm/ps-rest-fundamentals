import { PrismaClient } from "@prisma/client";
import { Item, ItemDTO, ItemDetail } from "../types";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import TTLCache from "@isaacs/ttlcache";

const options = { ttl: 1000 * 60 * 60 * 24 };
const cache = new TTLCache(options);

const prisma = new PrismaClient();
const listKey = "items-list";

export function getItems(): Promise<Item[]> {
  if (cache.has(listKey)) {
    const cacheItems = cache.get<Item[]>(listKey);
    if (cacheItems != undefined) {
      return Promise.resolve(cacheItems);
    }
  }

  return prisma.item
    .findMany({
      select: {
        id: true,
        name: true,
      },
    })
    .then((items) => {
      cache.set(listKey, items);
      return items;
    });
}

export function getItemDetail(itemId: number): Promise<ItemDetail | null> {
  return prisma.item.findFirst({
    where: { id: itemId },
  });
}

export function upsertItem(item: ItemDTO): Promise<Item | null> {
  return prisma.item
    .upsert({
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
    })
    .then((item) => {
      cache.delete(listKey);
      return item;
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
    })
    .then((item) => {
      cache.delete(listKey);
      return item;
    });
}
