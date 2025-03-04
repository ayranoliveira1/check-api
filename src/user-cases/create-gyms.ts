import { Gym } from "@prisma/client";
import { GymsRepository } from "@/repositories/gyms-repository";

interface GymsUseCaseRequest {
  title: string;
  description: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
}

interface GymsUseCaseResponse {
  gym: Gym;
}

export class GymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  }: GymsUseCaseRequest): Promise<GymsUseCaseResponse> {
    const gym = await this.gymsRepository.create({
      title,
      description,
      phone,
      latitude,
      longitude,
    });

    return { gym };
  }
}
