import type { Route } from "./+types/home";
import { NavLink } from "react-router";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export function loader() {
  return { message: "Hello from loader" };
}

export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
  const serverData = await serverLoader();
  console.log('clientLoader');
  return serverData;
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <NavLink to="/test">goto /test</NavLink>
      <br />
      <NavLink to="/redirect">goto /redirect</NavLink>
      <br />
      <NavLink to="/redirect" reloadDocument>goto /redirect (reload document)</NavLink>
    </>
  );
}
