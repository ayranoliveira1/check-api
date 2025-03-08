import { FetchNearbyGymsUseCase } from "../fetch-nearby-gyms";
import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";

export const makeFetchNearbyGymsUseCase = () => {
  const gymsRepository = new PrismaGymsRepository();
  const fetchNearbyUseCase = new FetchNearbyGymsUseCase(gymsRepository);

  return fetchNearbyUseCase;
};
