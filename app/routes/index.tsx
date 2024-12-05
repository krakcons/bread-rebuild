import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { getEvent } from "vinxi/http";

const getVariable = createServerFn("GET", async () => {
	const event = getEvent();
	return event.context.cloudflare.env.TEST_VAR;
});

export const Route = createFileRoute("/")({
	component: Home,
	loader: async () => await getVariable(),
});

function Home() {
	const variable = Route.useLoaderData();
	return <div>{variable}</div>;
}
