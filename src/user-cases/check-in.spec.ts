import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import { CheckInUseCase } from "./check-in";
import { InMemoryCheckInsRepository } from "../repositories/in-memory/in-memory-check-ins-repository";
import { InMemoryGymsRepository } from "../repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxNumberCheckInsError } from "./erros/max-number-check-ins-error";
import { MaxDistanceError } from "./erros/max-distance-error";

let checkInRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let checkInUseCase: CheckInUseCase;

describe("Check-in use case", () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    checkInUseCase = new CheckInUseCase(checkInRepository, gymsRepository);

    await gymsRepository.create({
      id: "gym-1",
      title: "JavaScript",
      phone: "",
      description: "",
      latitude: new Decimal(0),
      longitude: new Decimal(0),
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    const { checkIn } = await checkInUseCase.execute({
      userId: "user-01",
      gymId: "gym-1",
      userLatitude: 0,
      userLongitude: 0,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await checkInUseCase.execute({
      userId: "user-01",
      gymId: "gym-1",
      userLatitude: 0,
      userLongitude: 0,
    });

    await expect(async () => {
      await checkInUseCase.execute({
        userId: "user-01",
        gymId: "gym-1",
        userLatitude: 0,
        userLongitude: 0,
      });
    }).rejects.toBeInstanceOf(MaxNumberCheckInsError);
  });

  it("should be able to check in twice but in the different days", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await checkInUseCase.execute({
      userId: "user-01",
      gymId: "gym-1",
      userLatitude: 0,
      userLongitude: 0,
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    const { checkIn } = await checkInUseCase.execute({
      userId: "user-01",
      gymId: "gym-1",
      userLatitude: 0,
      userLongitude: 0,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in on distant gym", async () => {
    gymsRepository.items.push({
      id: "gym-2",
      title: "TypeScript",
      phone: "",
      description: "",
      latitude: new Decimal(-27.0747279),
      longitude: new Decimal(-49.4889672),
    });

    await expect(async () => {
      await checkInUseCase.execute({
        userId: "user-01",
        gymId: "gym-2",
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      });
    }).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
