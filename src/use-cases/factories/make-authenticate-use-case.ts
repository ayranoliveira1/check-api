import { PrismaUsersReposity } from "../../repositories/prisma/prisma-users-repository";
import { AuthenticateUseCase } from "../authenticate";

export const makeAuthenticateUseCase = () => {
  const usersersReposity = new PrismaUsersReposity();
  const authenticateUseCase = new AuthenticateUseCase(usersersReposity);

  return authenticateUseCase;
};
