import { FastifyInstance } from "fastify";
import { VerifyJwt } from "../../../middlewares/verify-jwt";
import { createCheckIns } from "./create-check-ins";
import { validateCheckIns } from "./validate-check-ins";
import { checkInsHistory } from "./check-ins-history";
import { checkInsMetrics } from "./metrics";

export async function CheckInsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", VerifyJwt);

  app.get("/check-ins/history", checkInsHistory);
  app.get("/check-ins/metrics", checkInsMetrics);

  app.post("/gyms/:gymId/check-ins", createCheckIns);
  app.patch("/check-ins/:checkInId/validate", validateCheckIns);
}
