import { PrismaClient } from "@prisma/client";
import { Customer, CustomerDTO } from "../types";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

export function getCustomers(): Promise<Customer[]> {
  return prisma.customer.findMany();
}

export function searchCustomers(query: string): Promise<Customer[]> {
  return prisma.customer.findMany({
    where: {
      OR: [
        {
          name: {
            contains: query,
          },
        },
        {
          email: {
            contains: query,
          },
        },
      ],
    },
  });
}

export function getCustomerDetail(
  customerId: string
): Promise<Customer | null> {
  return prisma.customer.findFirst({
    where: { id: customerId },
  });
}

export function upsertCustomer(
  customer: CustomerDTO
): Promise<Customer | null> {
  return prisma.customer.upsert({
    where: {
      id: customer.id || "",
    },
    update: {
      name: customer.name,
      email: customer.email,
    },
    create: {
      name: customer.name,
      email: customer.email,
    },
  });
}

export function deleteCustomer(customerId: string): Promise<Customer | null> {
  return prisma.customer
    .delete({
      where: { id: customerId },
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
