import dotenv from "dotenv";

dotenv.config();

export const port = parseInt(process.env.PORT || "8000", 10);
//export const hostname = process.env.HOSTNAME || "localhost";
export const hostname = "localhost";
export const dburl = process.env.DATABASE_URL || "file:data/db.sqlite";
export const CLIENT_ID = process.env.CLIENT_ID;
export const CLIENT_SECRET = process.env.CLIENT_SECRET;
