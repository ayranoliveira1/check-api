import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { RegisterUseCase } from "@/user-cases/register";
import { PrismaUsersReposity } from "@/repositories/prisma/prisma-users-repository";
import { UserAlreadyExistsError } from "@/user-cases/erros/user-already-exists-error";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodyshchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
  });

  const { name, email, password } = registerBodyshchema.parse(request.body);

  try {
    const usersersReposity = new PrismaUsersReposity();
    const registerUseCase = new RegisterUseCase(usersersReposity);

    await registerUseCase.execute({
      name,
      email,
      password,
    });
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    }

    throw error;
  }

  return reply.status(201).send();
}
