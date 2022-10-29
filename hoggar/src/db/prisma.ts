import { PrismaClient } from "@prisma/client";
import { dburl } from "../app/config";

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dburl,
    },
  },
});