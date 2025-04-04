import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "../repositories/in-memory/in-memory-gyms-repository";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms";

let gymsRepository: InMemoryGymsRepository;
let fetchNearbyGymsUseCase: FetchNearbyGymsUseCase;

describe("Fetch Nearby  gyms use case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    fetchNearbyGymsUseCase = new FetchNearbyGymsUseCase(gymsRepository);
  });

  it("should be able to Fetch Nearby Gyms", async () => {
    await gymsRepository.create({
      title: "Near Gym",
      description: "Academia de musculação",
      phone: "9293989389",
      latitude: -27.2092052,
      longitude: -49.6401091,
    });

    await gymsRepository.create({
      title: "Far Gym",
      description: "Academia de musculação",
      phone: "9293989389",
      latitude: -27.0610928,
      longitude: -49.5229501,
    });

    const { gyms } = await fetchNearbyGymsUseCase.execute({
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({
        title: "Near Gym",
      }),
    ]);
  });
});
