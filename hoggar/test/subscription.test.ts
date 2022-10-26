import { agent } from "supertest";
import app from "../src/app";

import { prisma } from "../services/prisma";

describe("POST /subscription", () => {
  beforeEach(async () => {
    await prisma.subscription.deleteMany();
  });
  it("add subscription to db with valid data", async () => {
    const res = await agent(app).post("/subscription").send({
      email: "email@exmaple.com",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("email", "email@exmaple.com");
    expect(res.body).toHaveProperty("source", null);
  });

  it("should verify source", async () => {
    const res = await agent(app).post("/subscription").send({
      email: "email@exmaple.com",
      source: "facebook",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("source", "facebook");
  });

  it("should verify email", async () => {
    const res = await agent(app).post("/subscription").send({
      email: "[/*@test.net",
    });
    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty("type");
    expect(res.body).toHaveProperty("message");
  });
  it("should verify duplicated email", async () => {
    await agent(app).post("/subscription").send({
      email: "duplicated@net.net",
    });
    const res = await agent(app).post("/subscription").send({
      email: "duplicated@net.net",
    });
    expect(res.statusCode).toEqual(409);
    expect(res.body).toHaveProperty("type");
    expect(res.body).toHaveProperty("message");
  });

  it("should verify email required field", async () => {
    const res = await agent(app).post("/subscription").send({
      source: "facebook",
    });
    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty("type");
    expect(res.body).toHaveProperty("message");
  });
});
