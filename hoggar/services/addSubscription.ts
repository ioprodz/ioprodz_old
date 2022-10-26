import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

import { prisma } from "./prisma";


enum Errors {
  DUPLICATE_ENTRY = "DUPLICATE_ENTRY",
}

export async function addSubscription(email: string, source: string) {
  const data = { email, source };

  try {
    const subscriber = await prisma.subscription.create({
      data: data,
    });
    return subscriber;
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw { message: "email already exist", type: Errors.DUPLICATE_ENTRY };
    }
    throw error;
  }
}
