import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "../repositories/in-memory/in-memory-gyms-repository";
import { GymsUseCase } from "./create-gyms";

let gymsRepository: InMemoryGymsRepository;
let gymsUseCase: GymsUseCase;

describe("Register use case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    gymsUseCase = new GymsUseCase(gymsRepository);
  });

  it("should be able to register", async () => {
    const { gym } = await gymsUseCase.execute({
      title: "Academia",
      description: "Academia de musculação",
      phone: "9293989389",
      latitude: -27.2092052,
      longitude: -49.6401091,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
