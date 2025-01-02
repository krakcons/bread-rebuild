import { createFileRoute, ErrorComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/$language/admin/_admin/")({
	component: RouteComponent,
	errorComponent: ErrorComponent,
});

function RouteComponent() {
	return <div>Hello "/$language/admin/_admin"!</div>;
}
