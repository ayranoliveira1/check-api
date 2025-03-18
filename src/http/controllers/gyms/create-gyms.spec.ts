import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../../../app";
import { prisma } from "../../../lib/prisma";
import { hash } from "bcryptjs";

describe("Create Gyms (e2e)", async () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to create a gym", async () => {
    await prisma.user.create({
      data: {
        name: "teste 4",
        email: "ayranaai85@gmail.com",
        password_hash: await hash("ayran123", 6),
        role: "ADMIN",
      },
    });

    const response = await request(app.server).post("/sessions").send({
      email: "ayranaai85@gmail.com",
      password: "ayran123",
    });

    const token = response.body.token;

    const responseGym = await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Academia teste",
        description: "Academia de musculação",
        phone: "9293989389",
        latitude: -27.2092052,
        longitude: -49.6401091,
      });

    expect(responseGym.status).toBe(201);
  });
});
