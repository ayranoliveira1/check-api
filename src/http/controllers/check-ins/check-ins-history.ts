import { makeFetchUserCheckInsHistoryUseCase } from "@/use-cases/factories/make-fetch-user-check-ins-history-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function checkInsHistory(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const checkInsHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  });

  const { page } = checkInsHistoryQuerySchema.parse(request.query);

  const checkInsHistoryUseCase = makeFetchUserCheckInsHistoryUseCase();

  const { checkIns } = await checkInsHistoryUseCase.execute({
    userId: request.user.sub,
    page,
  });

  reply.code(200).send({ checkIns });
}
