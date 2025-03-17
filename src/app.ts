import fastify from "fastify";
import { ZodError } from "zod";
import { env } from "./env";
import fastifyJwt from "@fastify/jwt";
import { appRoutes } from "./http/route";

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

app.register(appRoutes);

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
