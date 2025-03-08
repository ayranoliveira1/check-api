import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { GymsUseCase } from "../create-gyms";

export const makeCreateGymUseCase = () => {
  const gymsRepository = new PrismaGymsRepository();
  const gymsUseCase = new GymsUseCase(gymsRepository);

  return gymsUseCase;
};
