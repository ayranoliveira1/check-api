import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { InvalidCredentialsError } from "@/user-cases/erros/invalid-credentials-error";
import { makeAuthenticateUseCase } from "@/user-cases/factories/make-authenticate-use-case";

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
    const authenticateUseCase = makeAuthenticateUseCase();

    const { user } = await authenticateUseCase.execute({
      email,
      password,
    });

    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
        },
      }
    );

    return reply.status(200).send({ token });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message });
    }

    throw error;
  }
}
