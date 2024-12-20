import { getAuth, sendVerificationEmail } from "@/server/auth/actions";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/$language/admin/_admin")({
	component: RouteComponent,
	beforeLoad: async ({ params }) => {
		const { user, session } = await getAuth();
		if (user === null) {
			throw redirect({
				to: "/$language/admin/login",
				params,
			});
		}
		if (user.emailVerified === null) {
			await sendVerificationEmail();
			throw redirect({
				to: "/$language/admin/verify-email",
				params,
			});
		}
		return { user, session };
	},
});

function RouteComponent() {
	return (
		<div>
			<h1>Admin</h1>
			<Outlet />
		</div>
	);
}
