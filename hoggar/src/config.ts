import dotenv from "dotenv";

dotenv.config();

export const port = parseInt(process.env.PORT || "8000", 10);
export const hostname = process.env.HOSTNAME || "localhost";
