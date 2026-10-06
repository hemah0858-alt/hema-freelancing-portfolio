import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/request")({
  beforeLoad: () => { throw redirect({ to: "/request-website", statusCode: 301 }); },
});
