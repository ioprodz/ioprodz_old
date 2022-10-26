import { PrismaClient } from "@prisma/client";
import { dburl } from "../src/config";

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dburl,
    },
  },
});
