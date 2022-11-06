import { agent } from "supertest";
import { mockModule } from "./utils";
import jwt from "jsonwebtoken";
mockModule("../src/app/config", {
  authGithubClientId: "fake-github-client-id",
  authJWTSecret: "fake-jwt-secret",
});

const MOCK_getAccessToken = jest.fn();
const MOCK_getUserData = jest.fn();
mockModule("../src/auth/github-api.service", {
  getAccessToken: MOCK_getAccessToken,
  getUserData: MOCK_getUserData,
});

import app from "../src/app";
import { prisma } from "../src/db/prisma";

describe("/auth (authentication)", () => {
  beforeEach(async () => {
    await prisma.identity.deleteMany();
  });
  describe("/auth/github", () => {
    describe("GET /auth/github", () => {
      it("should redirect to github auth page with our client id", async () => {
        const res = await agent(app).get("/auth/github");
        expect(res.statusCode).toBe(302);
        expect(res.headers.location).toBe(
          "https://github.com/login/oauth/authorize?client_id=fake-github-client-id"
        );
      });
    });
    describe("GET /auth/github/callback?code=:code", () => {
      it("should return 403 if code not present", async () => {
        const res = await agent(app)
          .get("/auth/github/callback")
          .set("user-agent", "test-ua");
        expect(res.statusCode).toBe(403);
      });

      it("should return 403 if code not present", async () => {
        const res = await agent(app).get("/auth/github/callback");
        expect(res.statusCode).toBe(403);
      });
      it("should return 401 if code does not authenticate with github", async () => {
        const res = await agent(app)
          .get("/auth/github/callback?code=fake-code")
          .set("user-agent", "test-ua");
        expect(res.statusCode).toBe(401);
      });
      it("should return 201 and create user if he does not exist", async () => {
        MOCK_getAccessToken.mockResolvedValue("fake-gh-access-token");
        MOCK_getUserData.mockResolvedValue({
          data: {
            id: "12345",
            email: "fake-email@example.com",
            name: "Mokhtar",
            bio: "fake-bio",
            login: "fake-gh-user",
            avatar_url: "fake-avatar-url",
            blog: "fake-website-url",
            location: "fake-location",
            company: "fake-company",
          },
        });
        const res = await agent(app)
          .get("/auth/github/callback?code=fake-code")
          .set("user-agent", "fake-ua-string");
        expect(MOCK_getAccessToken).toHaveBeenCalledWith("fake-code");
        expect(MOCK_getUserData).toHaveBeenCalledWith("fake-gh-access-token");
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("access_token");
        expect(res.body).toHaveProperty("refresh_token");

        const identity = await prisma.identity.findFirst({});
        expect(identity).toHaveProperty("id");
        expect(identity).toHaveProperty("provider", "github");
        expect(identity).toHaveProperty("providerId", "12345");
        expect(identity).toHaveProperty("email", "fake-email@example.com");

        const profile = await prisma.profile.findFirst();
        expect(profile).toHaveProperty("identityId", identity?.id);
        expect(profile).toHaveProperty("name", "Mokhtar");
        expect(profile).toHaveProperty("bio", "fake-bio");
        expect(profile).toHaveProperty("githubUser", "fake-gh-user");
        expect(profile).toHaveProperty("avatarUrl", "fake-avatar-url");
        expect(profile).toHaveProperty("websiteUrl", "fake-website-url");
        expect(profile).toHaveProperty("location", "fake-location");
        expect(profile).toHaveProperty("company", "fake-company");
      });
      it("should return 201 and update user if he exists", async () => {
        MOCK_getAccessToken.mockResolvedValue("fake-gh-access-token");
        MOCK_getUserData.mockResolvedValue({
          data: {
            id: "12345",
            email: "fake-email@example.com",
            name: "Mokhtar",
          },
        });
        const existingIdentity = await prisma.identity.create({
          data: {
            provider: "github",
            providerId: "12345",
            email: "fake-email@example.com",
          },
        });
        await prisma.profile.create({
          data: { identityId: existingIdentity.id, name: "Hmida" },
        });
        const res = await agent(app)
          .get("/auth/github/callback?code=fake-code")
          .set("user-agent", "fake-ua-string");
        expect(MOCK_getAccessToken).toHaveBeenCalledWith("fake-code");
        expect(MOCK_getUserData).toHaveBeenCalledWith("fake-gh-access-token");
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("access_token");
        expect(res.body).toHaveProperty("refresh_token");

        const identity = await prisma.identity.findMany({});
        expect(identity).toHaveLength(1);
        const profile = await prisma.profile.findMany({});
        expect(profile).toHaveLength(1);
        expect(profile[0]).toHaveProperty("name", "Mokhtar");
      });

      it("should return 201 and create session + generate tokens", async () => {
        MOCK_getAccessToken.mockResolvedValue("fake-gh-access-token");
        MOCK_getUserData.mockResolvedValue({
          data: {
            id: "12345",
            email: "fake-email@example.com",
            name: "Mokhtar",
          },
        });
        const res = await agent(app)
          .get("/auth/github/callback?code=fake-code")
          .set("user-agent", "fake-ua-string");
        expect(MOCK_getAccessToken).toHaveBeenCalledWith("fake-code");
        expect(MOCK_getUserData).toHaveBeenCalledWith("fake-gh-access-token");
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("access_token");
        expect(res.body).toHaveProperty("refresh_token");

        const identity = await prisma.identity.findFirstOrThrow();
        const session = await prisma.session.findFirstOrThrow();

        const { access_token, refresh_token } = res.body;

        const decoded_access_token = jwt.decode(access_token);
        expect(decoded_access_token).toHaveProperty("sub", identity.id);

        const decoded_refresh_token = jwt.decode(refresh_token);
        expect(decoded_refresh_token).toHaveProperty("sub", identity.id);
        expect(decoded_refresh_token).toHaveProperty("sid", session.id);
      });
    });
  });

  describe("POST /auth/refresh", () => {
    it("should return 403 and error when no token is provided", async () => {
      const res = await agent(app).post("/auth/refresh");
      expect(res.statusCode).toBe(403);
    });
    it("should return 403 and error when no user-agent is provided", async () => {
      const res = await agent(app)
        .post("/auth/refresh")
        .send({ refresh_token: "some-token" });
      expect(res.statusCode).toBe(403);
    });
    it("should return 401 and error when token is invalid", async () => {
      const res = await agent(app)
        .post("/auth/refresh")
        .set("user-agent", "user-agent-string")
        .send({ refresh_token: "invalid-token" });
      expect(res.statusCode).toBe(401);
    });
    it("should return 401 and error when identity not found", async () => {
      const payload = {
        sub: "fake-identity",
        sid: "fake-session-id",
      };
      const refresh_token = jwt.sign(payload, "fake-jwt-secret");
      const res = await agent(app)
        .post("/auth/refresh")
        .set("user-agent", "user-agent-string")
        .send({ refresh_token });
      expect(res.statusCode).toBe(401);
    });
    it("should return 401 and error when identity is disabled", async () => {
      const identity = await prisma.identity.create({
        data: {
          email: "johndoe@example.com",
          providerId: "12345",
          provider: "github",
          active: false,
        },
      });
      const session = await prisma.session.create({
        data: {
          identityId: identity.id,
          uaIdentifier: "user-agent-string",
        },
      });
      const payload = {
        sub: identity.id,
        sid: session.id,
      };
      const valid_rft = jwt.sign(payload, "fake-jwt-secret");
      const res = await agent(app)
        .post("/auth/refresh")
        .set("user-agent", "user-agent-string")
        .send({ refresh_token: valid_rft });
      expect(res.statusCode).toBe(401);
    });
    it("should return 401 and error when session not found", async () => {
      const identity = await prisma.identity.create({
        data: {
          email: "johndoe@example.com",
          providerId: "12345",
          provider: "github",
        },
      });
      const payload = {
        sub: identity.id,
        sid: "fake-session-id",
      };
      const refresh_token = jwt.sign(payload, "fake-jwt-secret");
      const res = await agent(app)
        .post("/auth/refresh")
        .set("user-agent", "user-agent-string")
        .send({ refresh_token });
      expect(res.statusCode).toBe(401);
    });

    it("should return 401 when user agent does not match", async () => {
      const identity = await prisma.identity.create({
        data: {
          email: "johndoe@example.com",
          providerId: "12345",
          provider: "github",
        },
      });
      const session = await prisma.session.create({
        data: {
          identityId: identity.id,
          uaIdentifier: "user-agent-string",
        },
      });
      const payload = {
        sub: identity.id,
        sid: session.id,
      };
      const valid_rft = jwt.sign(payload, "fake-jwt-secret");
      const res = await agent(app)
        .post("/auth/refresh")
        .set("user-agent", "other-user-agent")
        .send({ refresh_token: valid_rft });
      expect(res.statusCode).toBe(401);
    });
    it("should return 401 when token does not match iat (already used)", async () => {
      const identity = await prisma.identity.create({
        data: {
          email: "johndoe@example.com",
          providerId: "12345",
          provider: "github",
        },
      });
      const updatedAt = new Date();
      updatedAt.setSeconds(updatedAt.getSeconds() - 2);
      const session = await prisma.session.create({
        data: {
          identityId: identity.id,
          uaIdentifier: "user-agent-string",
          updatedAt,
        },
      });
      const payload = {
        sub: identity.id,
        sid: session.id,
      };
      const valid_rft = jwt.sign(payload, "fake-jwt-secret");
      const res = await agent(app)
        .post("/auth/refresh")
        .set("user-agent", "user-agent-string")
        .send({ refresh_token: valid_rft });
      expect(res.statusCode).toBe(401);
    });
    it("should return 201 issue new tokens", async () => {
      const identity = await prisma.identity.create({
        data: {
          email: "johndoe@example.com",
          providerId: "12345",
          provider: "github",
        },
      });
      const session = await prisma.session.create({
        data: {
          identityId: identity.id,
          uaIdentifier: "user-agent-string",
        },
      });
      const payload = {
        sub: identity.id,
        sid: session.id,
      };
      const valid_rft = jwt.sign(payload, "fake-jwt-secret");
      const res = await agent(app)
        .post("/auth/refresh")
        .set("user-agent", "user-agent-string")
        .send({ refresh_token: valid_rft });
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("access_token");
      expect(res.body).toHaveProperty("refresh_token");
      const { access_token, refresh_token } = res.body;
      const decoded_act = jwt.decode(access_token);
      const decoded_rft = jwt.decode(refresh_token);
      expect(decoded_act).toHaveProperty("sub", identity.id);
      expect(decoded_rft).toHaveProperty("sub", identity.id);
      expect(decoded_rft).toHaveProperty("sid", session.id);
    });
  });
});
