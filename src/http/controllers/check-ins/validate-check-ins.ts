import { makeValidateCheckInUseCase } from "@/use-cases/factories/make-validate-check-in-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function validateCheckIns(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const validateCheckInsParamsSchema = z.object({
    checkInsId: z.string().uuid(),
  });

  const { checkInsId } = validateCheckInsParamsSchema.parse(request.params);

  const validateCheckInUseCase = makeValidateCheckInUseCase();

  await validateCheckInUseCase.execute({
    checkInId: checkInsId,
  });

  reply.status(204).send();
}
