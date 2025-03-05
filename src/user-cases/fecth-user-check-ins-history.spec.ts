import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryCheckInsRepository } from "../repositories/in-memory/in-memory-check-ins-repository";

import { FetchUserCheckInsHistoryUseCase } from "./fecth-user-check-ins-history";

let checkInRepository: InMemoryCheckInsRepository;
let fetchUserCheckInsHistoryUseCase: FetchUserCheckInsHistoryUseCase;

describe("Fetch User Check-in History use case", () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository();
    fetchUserCheckInsHistoryUseCase = new FetchUserCheckInsHistoryUseCase(
      checkInRepository
    );
  });

  it("should be able to fetch check-in history", async () => {
    await checkInRepository.create({
      user_id: "user-01",
      gym_id: "gym-01",
    });

    await checkInRepository.create({
      user_id: "user-01",
      gym_id: "gym-02",
    });

    const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({
      userId: "user-01",
      page: 1,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({
        gym_id: "gym-01",
      }),
      expect.objectContaining({
        gym_id: "gym-02",
      }),
    ]);
  });

  it("should be able to fetch paginated check-in history", async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInRepository.create({
        user_id: "user-01",
        gym_id: `gym-${i}`,
      });
    }

    const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({
      userId: "user-01",
      page: 2,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({
        gym_id: "gym-21",
      }),
      expect.objectContaining({
        gym_id: "gym-22",
      }),
    ]);
  });
});
