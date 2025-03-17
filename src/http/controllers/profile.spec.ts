import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../../app";

describe("profile (e2e)", async () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to get user profile", async () => {
    await request(app.server).post("/users").send({
      name: "teste 3",
      email: "ayranaai84@gmail.com",
      password: "ayran123",
    });

    const authResponse = await request(app.server).post("/sessions").send({
      email: "ayranaai84@gmail.com",
      password: "ayran123",
    });

    const { token } = authResponse.body;

    const profileResponse = await request(app.server)
      .get("/profile")
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(profileResponse.statusCode).toBe(200);
    expect(profileResponse.body.user).toEqual(
      expect.objectContaining({
        email: "ayranaai84@gmail.com",
      })
    );
  });
});
