import {
	createFileRoute,
	ErrorComponent,
	Outlet,
} from "@tanstack/react-router";

export const Route = createFileRoute("/$language/admin/_admin")({
	component: RouteComponent,
	errorComponent: ErrorComponent,
});

function RouteComponent() {
	return (
		<div>
			<Outlet />
		</div>
	);
}
