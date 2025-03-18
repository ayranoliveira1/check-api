import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../../../app";
import { hash } from "bcryptjs";
import { prisma } from "../../../lib/prisma";

describe("Nearby Gyms (e2e)", async () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to list nearby gyms", async () => {
    await prisma.user.create({
      data: {
        name: "teste 4",
        email: "ayranaai87@gmail.com",
        password_hash: await hash("ayran123", 6),
        role: "ADMIN",
      },
    });

    const response = await request(app.server).post("/sessions").send({
      email: "ayranaai87@gmail.com",
      password: "ayran123",
    });

    const token = response.body.token;

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "JavaScript Gym",
        description: "Academia de musculação",
        phone: "9293989389",
        latitude: -27.0610928,
        longitude: -49.5229501,
      });

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Academia Gym",
        description: "Academia de musculação",
        phone: "9293989389",
        latitude: -27.2092052,
        longitude: -49.6401091,
      });

    const responseSearch = await request(app.server)
      .get("/gyms/nearby")
      .query({ userLatitude: -27.0610928, userLongitude: -49.5229501 })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(responseSearch.statusCode).toBe(200);
    expect(responseSearch.body.gyms).toHaveLength(1);
    expect(responseSearch.body.gyms).toEqual([
      expect.objectContaining({
        title: "JavaScript Gym",
      }),
    ]);
  });
});
