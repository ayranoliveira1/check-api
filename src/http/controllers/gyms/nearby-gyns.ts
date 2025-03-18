import { makeFetchNearbyGymsUseCase } from "@/use-cases/factories/make-fetch-nearby-gyms-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function nearbyGyms(request: FastifyRequest, reply: FastifyReply) {
  const nearbyGymsBodySchema = z.object({
    latitude: z.number().refine((value) => Math.abs(value) <= 90),
    longitude: z.number().refine((value) => Math.abs(value) <= 180),
  });

  const { latitude, longitude } = nearbyGymsBodySchema.parse(request.body);

  const nearbyGymsUseCase = makeFetchNearbyGymsUseCase();

  const { gyms } = await nearbyGymsUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  });
  reply.code(200).send({ gyms });
}
