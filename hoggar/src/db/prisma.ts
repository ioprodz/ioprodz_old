import { PrismaClient } from "@prisma/client";
import config from "../app/config";

const { dburl } = config;

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dburl,
    },
  },
});
