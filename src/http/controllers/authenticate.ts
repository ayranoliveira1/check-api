import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { RegisterUseCase } from "@/user-cases/register";
import { PrismaUsersReposity } from "@/repositories/prisma/prisma-users-repository";
import { UserAlreadyExistsError } from "@/user-cases/erros/user-already-exists-error";
import { AuthenticateUseCase } from "@/user-cases/authenticate";
import { InvalidCredentialsError } from "@/user-cases/erros/invalid-credentials-error";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const registerBodyshchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });

  const { email, password } = registerBodyshchema.parse(request.body);

  try {
    const usersersReposity = new PrismaUsersReposity();
    const authenticateUseCase = new AuthenticateUseCase(usersersReposity);

    await authenticateUseCase.execute({
      email,
      password,
    });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message });
    }

    throw error;
  }

  return reply.status(200).send();
}
