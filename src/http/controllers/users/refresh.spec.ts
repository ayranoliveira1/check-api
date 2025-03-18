import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../../../app";

describe("Refresh (e2e)", async () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to authenticate", async () => {
    await request(app.server).post("/users").send({
      name: "teste 23",
      email: "ayranaai50@gmail.com",
      password: "ayran123",
    });

    const authResponse = await request(app.server).post("/sessions").send({
      email: "ayranaai50@gmail.com",
      password: "ayran123",
    });

    const cookies = authResponse.get("Set-cookie");

    const response = await request(app.server)
      .patch("/token/refresh")
      .set("Cookie", cookies!)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ token: expect.any(String) });
    expect(response.get("Set-cookie")).toEqual([
      expect.stringContaining("refreshToken="),
    ]);
  });
});
