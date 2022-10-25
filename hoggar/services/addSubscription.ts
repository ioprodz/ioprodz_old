import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

const prisma = new PrismaClient();

export async function addSubscription(email: string, source: string) {
  const data = {
    email: email,
    source: source,
  };
  try {
    const subscriber = await prisma.subscription.create({
      data: data,
    });
    return subscriber;
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return new Error("duplicate_email");
      }
    }
    throw error;
  }
}
