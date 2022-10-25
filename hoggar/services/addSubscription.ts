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
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error(Errors.DUPLICATE_ENTRY);
      }
    }
    throw error;
  }
}
