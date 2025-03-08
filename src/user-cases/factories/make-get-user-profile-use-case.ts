import { PrismaUsersReposity } from "@/repositories/prisma/prisma-users-repository";
import { GetUserProfileUseCase } from "../get-user-profile";

export const makeGetUserProfileUseCase = () => {
  const usersRepository = new PrismaUsersReposity();
  const getUserProfileUseCase = new GetUserProfileUseCase(usersRepository);

  return getUserProfileUseCase;
};
