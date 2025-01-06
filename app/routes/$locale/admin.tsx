import { getAuth, sendVerificationEmail } from "@/server/auth/actions";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

const unauthenticatedPages = [
	"/login",
	"/signup",
	"/reset-password",
	"/verify-email",
];

export const Route = createFileRoute("/$locale/admin")({
	component: RouteComponent,
	beforeLoad: async ({ params, location }) => {
		const { user, session, providerId } = await getAuth();

		if (
			user === null &&
			// Dont redirect to login if user is already on an unauthenticated page
			!unauthenticatedPages.some((path) =>
				location.pathname.includes(path),
			)
		) {
			throw redirect({
				to: "/$locale/admin/login",
				params,
			});
		}

		if (
			!location.pathname.includes("/verify-email") &&
			user?.emailVerified === null
		) {
			await sendVerificationEmail();
			throw redirect({
				to: "/$locale/admin/verify-email",
				params,
			});
		}

		if (
			!location.pathname.includes("/onboarding") &&
			user &&
			user.emailVerified &&
			session &&
			providerId === null
		) {
			throw redirect({
				to: "/$locale/admin/onboarding",
				params,
			});
		}

		return { user, session, providerId };
	},
});

function RouteComponent() {
	return <Outlet />;
}
