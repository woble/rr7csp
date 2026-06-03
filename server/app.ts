import { RouterContextProvider, createContext } from "react-router";
import { createRequestHandler } from "@react-router/express";
import express from "express";

export const nonceContext = createContext<string | undefined>();

declare global {
  namespace Express {
    interface Request {
      nonce?: string;
    }
  }
}

export const app = express();

app.use(
  createRequestHandler({
    build: () => import("virtual:react-router/server-build"),
    getLoadContext(req) {
      const context = new RouterContextProvider();
      context.set(nonceContext, req.nonce);
      return context;
    },
  }),
);
