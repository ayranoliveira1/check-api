import { FastifyInstance } from "fastify";
import { VerifyJwt } from "../../../middlewares/verify-jwt";
import { createGyms } from "./create-gyms";
import { searchGyms } from "./search-gyms";
import { nearbyGyms } from "./nearby-gyns";
import { verifyUserRole } from "../../../middlewares/verify-user-role";

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", VerifyJwt);

  app.get("/gyms/search", searchGyms);
  app.get("/gyms/nearby", nearbyGyms);

  app.post("/gyms", { onRequest: [verifyUserRole("ADMIN")] }, createGyms);
}
