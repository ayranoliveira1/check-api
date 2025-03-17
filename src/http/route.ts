import { FastifyInstance } from "fastify";
import { register } from "./controllers/register";
import { profile } from "./controllers/profile";
import { authenticate } from "./controllers/authenticate";
import { VerifyJwt } from "../middlewares/verify-jwt";

export async function apppRoutes(app: FastifyInstance) {
  app.post("/users", register);

  app.post("/sessions", authenticate);

  // Authenticated
  app.get("/profile", { onRequest: [VerifyJwt] }, profile);
}
