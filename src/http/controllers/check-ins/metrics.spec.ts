import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../../../app";
import { prisma } from "../../../lib/prisma";

describe("Check-ins metrics (e2e)", async () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to get the total count of check-ins", async () => {
    const responseUser = await request(app.server).post("/users").send({
      name: "teste 9",
      email: "ayranaai90@gmail.com",
      password: "ayran123",
    });

    const response = await request(app.server).post("/sessions").send({
      email: "ayranaai90@gmail.com",
      password: "ayran123",
    });

    const token = response.body.token;

    const gym = await prisma.gym.create({
      data: {
        title: "Academia teste 3",
        description: "Academia de musculação",
        phone: "9293989389",
        latitude: -27.2092052,
        longitude: -49.6401091,
      },
    });

    await prisma.checkIn.createMany({
      data: [
        {
          user_id: responseUser.body.id,
          gym_id: gym.id,
        },
        {
          user_id: responseUser.body.id,
          gym_id: gym.id,
        },
      ],
    });

    const responseChekIn = await request(app.server)
      .get(`/check-ins/metrics`)
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(responseChekIn.status).toBe(200);
    expect(responseChekIn.body.checkInsCount).toEqual(2);
  });
});
