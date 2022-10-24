import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

const prisma = new PrismaClient();

export async function addSubscription(email: string) {
  const data = {
    email: email,
  };
  try {
    const subscriber = await prisma.subscription.create({
      data: data,
    });
    return subscriber;
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return "already subscribed !!!";
      }
    }
    throw error;
  }
}
