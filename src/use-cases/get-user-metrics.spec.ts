import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryCheckInsRepository } from "../repositories/in-memory/in-memory-check-ins-repository";
import { GetUserMetricsUseCase } from "./get-user-metrics";

let checkInRepository: InMemoryCheckInsRepository;
let getUserMetricsUseCase: GetUserMetricsUseCase;

describe("Get User Metrics use case", () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository();
    getUserMetricsUseCase = new GetUserMetricsUseCase(checkInRepository);
  });

  it("should be able to Get checki-in count for metrics", async () => {
    await checkInRepository.create({
      user_id: "user-01",
      gym_id: "gym-01",
    });

    await checkInRepository.create({
      user_id: "user-01",
      gym_id: "gym-02",
    });

    const { checkInsCount } = await getUserMetricsUseCase.execute({
      userId: "user-01",
    });

    expect(checkInsCount).toEqual(2);
  });
});
