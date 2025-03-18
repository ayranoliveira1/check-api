import { makeCreateGymUseCase } from "../../../use-cases/factories/make-create-gym-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function createGyms(request: FastifyRequest, reply: FastifyReply) {
  const createGymsBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => Math.abs(value) <= 90),
    longitude: z.number().refine((value) => Math.abs(value) <= 180),
  });

  const { title, description, phone, latitude, longitude } =
    createGymsBodySchema.parse(request.body);

  const createGynsUseCase = makeCreateGymUseCase();

  await createGynsUseCase.execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  });

  reply.code(201).send();
}
