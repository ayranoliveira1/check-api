import { FastifyInstance } from "fastify";
import { register } from "./register";
import { profile } from "./profile";
import { authenticate } from "./authenticate";
import { VerifyJwt } from "../../../middlewares/verify-jwt";

export async function usersRoutes(app: FastifyInstance) {
  app.post("/users", register);

  app.post("/sessions", authenticate);

  // Authenticated
  app.get("/profile", { onRequest: [VerifyJwt] }, profile);
}
