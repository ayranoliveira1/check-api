import { PrismaUsersReposity } from "@/repositories/prisma/prisma-users-repository";
import { RegisterUseCase } from "../register";

export function makeRegisterUseCAse() {
  const usersersReposity = new PrismaUsersReposity();
  const registerUseCase = new RegisterUseCase(usersersReposity);

  return registerUseCase;
}
