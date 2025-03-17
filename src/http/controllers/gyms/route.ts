import { FastifyInstance } from "fastify";
import { VerifyJwt } from "../../../middlewares/verify-jwt";

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", VerifyJwt);
}
