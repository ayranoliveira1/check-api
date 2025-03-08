import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { FetchUserCheckInsHistoryUseCase } from "../fecth-user-check-ins-history";

export const makeFetchUserCheckInsHistoryUseCase = () => {
  const checkInsRepository = new PrismaCheckInsRepository();
  const fetchUserCheckInUseCase = new FetchUserCheckInsHistoryUseCase(
    checkInsRepository
  );

  return fetchUserCheckInUseCase;
};
