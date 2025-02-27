import fastify from "fastify";
import { apppRoutes } from "./http/route";
import { ZodError } from "zod";
import { env } from "./env";

export const app = fastify();

app.register(apppRoutes);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      error: "Invalid type",
      message: error.errors[0].message,
      path: error.errors[0].path[0],
    });
  }

  if (env.NODE_ENV !== "production") {
    console.error(error);
  } else {
    //TODO: Send error to monitoring service
  }

  return reply.status(500).send({
    message: "Internal server error",
  });
});
