import { FastifyInstance } from "fastify";
import { register } from "./controllers/register";
import { authenticate } from "./controllers/authenticate";

export async function apppRoutes(app: FastifyInstance) {
  app.post("/user", register);

  app.post("/sessions", authenticate);
}
