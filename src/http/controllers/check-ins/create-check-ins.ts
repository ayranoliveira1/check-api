import { makeChekInUseCase } from "../../../use-cases/factories/make-check-in-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function createCheckIns(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const createCheckInsParamsSchema = z.object({
    gymId: z.string().uuid(),
  });

  const createCheckInsBodySchema = z.object({
    userLatitude: z.coerce.number().refine((value) => Math.abs(value) <= 90),
    userLongitude: z.coerce.number().refine((value) => Math.abs(value) <= 180),
  });

  const { gymId } = createCheckInsParamsSchema.parse(request.params);

  const { userLatitude, userLongitude } = createCheckInsBodySchema.parse(
    request.body
  );

  const checkInsUseCase = makeChekInUseCase();

  await checkInsUseCase.execute({
    userId: request.user.sub,
    gymId,
    userLatitude,
    userLongitude,
  });

  return reply.status(201).send();
}
