import { FastifyInstance } from "fastify";
import { register } from "./controllers/register";

export async function apppRoutes(app: FastifyInstance) {
  app.post("/user", register);
}
