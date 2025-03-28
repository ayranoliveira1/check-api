import { makeGetUserMetricsUseCase } from "../../../use-cases/factories/make-get-user-metrics-use-case";
import { FastifyReply, FastifyRequest } from "fastify";

export async function checkInsMetrics(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const getUserMetricsUseCase = makeGetUserMetricsUseCase();

  const { checkInsCount } = await getUserMetricsUseCase.execute({
    userId: request.user.sub,
  });

  return reply.code(200).send({ checkInsCount });
}
