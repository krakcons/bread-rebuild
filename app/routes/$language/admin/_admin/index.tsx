import { Button } from "@/components/ui/Button";
import { logout } from "@/server/auth/actions";
import { createFileRoute, ErrorComponent } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/start";

export const Route = createFileRoute("/$language/admin/_admin/")({
	component: RouteComponent,
	errorComponent: ErrorComponent,
});

function RouteComponent() {
	const logoutFn = useServerFn(logout);

	return (
		<div>
			Hello "/$language/admin/_admin"!
			<Button onClick={() => logoutFn()}>Logout</Button>
		</div>
	);
}
