import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../../../app";
import { prisma } from "../../../lib/prisma";

describe("Create Check ins (e2e)", async () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to create a check in", async () => {
    await request(app.server).post("/users").send({
      name: "teste 7",
      email: "ayranaai88@gmail.com",
      password: "ayran123",
    });

    const response = await request(app.server).post("/sessions").send({
      email: "ayranaai88@gmail.com",
      password: "ayran123",
    });

    const token = response.body.token;

    const gym = await prisma.gym.create({
      data: {
        title: "Academia teste 2",
        description: "Academia de musculação",
        phone: "9293989389",
        latitude: -27.2092052,
        longitude: -49.6401091,
      },
    });

    const responseChekIn = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      });

    expect(responseChekIn.status).toBe(201);
  });
});
