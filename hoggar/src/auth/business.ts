import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { object, string } from "yup";
import { prisma } from "../db/prisma";

enum Errors {
  DUPLICATE_ENTRY = "DUPLICATE_ENTRY",
}
