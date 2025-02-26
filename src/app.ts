import fastify from "fastify";
import { apppRoutes } from "./http/route";

export const app = fastify();

app.register(apppRoutes);
