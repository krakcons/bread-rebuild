import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/$language/admin/")({
	component: RouteComponent,
	loader: ({ params }) => {
		throw redirect({
			to: "/$language/admin/login",
			params,
		});
	},
});

function RouteComponent() {
	return <div>Hello "/$language/admin/"!</div>;
}
