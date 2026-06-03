import {
  data,
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from "react-router";
import type { PropsWithChildren } from "react";

import type { Route } from "./+types/root";
import { nonceContext } from "../server/app";
import "./app.css";

export async function loader({ context }: Route.LoaderArgs) {
  return data({ nonce: context.get(nonceContext) });
}

type DocumentProps = PropsWithChildren & {
  loaderData?: Route.ComponentProps["loaderData"];
};

function Document({ children, loaderData }: DocumentProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links nonce={loaderData?.nonce} />
      </head>
      <body>
        {children}
        <ScrollRestoration nonce={loaderData?.nonce} />
        <Scripts nonce={loaderData?.nonce} />
      </body>
    </html>
  );
}

export default function App({ loaderData }: Route.ComponentProps) {
  return (
    <Document loaderData={loaderData}>
      <Outlet />
    </Document>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const loaderData = useRouteLoaderData<Route.ComponentProps["loaderData"] | undefined>("root");

  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <Document loaderData={loaderData}>
      <main className="pt-16 p-4 container mx-auto">
        <h1>{message}</h1>
        <p>{details}</p>
        {stack && (
          <pre className="w-full p-4 overflow-x-auto">
            <code>{stack}</code>
          </pre>
        )}
      </main>
    </Document>
  );
}
