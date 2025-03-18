import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../../../app";
import { prisma } from "../../../lib/prisma";
import { hash } from "bcryptjs";

describe("Validate Check ins (e2e)", async () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to validate a check in", async () => {
    const responseUser = await prisma.user.create({
      data: {
        name: "teste 10",
        email: "ayyranaai91@gmail.com",
        password_hash: await hash("ayran123", 6),
        role: "ADMIN",
      },
    });

    const response = await request(app.server).post("/sessions").send({
      email: "ayyranaai91@gmail.com",
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

    const checkIn = await prisma.checkIn.create({
      data: {
        user_id: responseUser.id,
        gym_id: gym.id,
      },
    });

    const responseChekIn = await request(app.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    const checkIns = await prisma.checkIn.findUniqueOrThrow({
      where: {
        id: checkIn.id,
      },
    });

    expect(responseChekIn.status).toBe(204);
    expect(checkIns.validated_at).toEqual(expect.any(Date));
  });
});
