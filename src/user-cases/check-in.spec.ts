import { expect, describe, it, beforeEach } from "vitest";
import { CheckInUseCase } from "./check-in";
import { InMemoryCheckInsRepository } from "../repositories/in-memory/in-memory-check-ins-repository";

let checkInRepository: InMemoryCheckInsRepository;
let checkInUseCase: CheckInUseCase;

describe("Check-in use case", () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInsRepository();
    checkInUseCase = new CheckInUseCase(checkInRepository);
  });

  it("should be able to check in", async () => {
    const { checkIn } = await checkInUseCase.execute({
      userId: "user-o1",
      gymId: "gym-o1",
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
});
