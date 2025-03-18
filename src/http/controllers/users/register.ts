import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { UserAlreadyExistsError } from "../../../use-cases/erros/user-already-exists-error";
import { makeRegisterUseCAse } from "../../../use-cases/factories/make-register-use-case";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodyshchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
  });

  const { name, email, password } = registerBodyshchema.parse(request.body);

  try {
    const registerUseCase = makeRegisterUseCAse();

    const { user } = await registerUseCase.execute({
      name,
      email,
      password,
    });

    return reply.status(201).send({ id: user.id });
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    }

    throw error;
  }
}
