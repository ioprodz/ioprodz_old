import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { object, string } from "yup";
import { prisma } from "../db/prisma";

enum Errors {
  DUPLICATE_ENTRY = "DUPLICATE_ENTRY",
}

const subscriberSchema = object({
  email: string().email().required(),
  source: string(),
}).required();

export async function addSubscription(email: string, source: string) {
  const data = { email, source };
  try {
    subscriberSchema.validateSync(data);
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
