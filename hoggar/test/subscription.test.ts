import { agent } from "supertest";
import app from "../src/app";

import { prisma } from "../services/prisma";

describe("subscribe", () => {
  beforeEach(async () => {
    await prisma.subscription.deleteMany();
  });
  it("should respond", async () => {
    const res = await agent(app).post("/subscription").send({
      email: "email@exmaple.com",
      source: "fake-source",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("email", "email@exmaple.com");
    expect(res.body).toHaveProperty("source", "fake-source");
  });
});
