import {
	getUserNeedsOnboarding,
	sendVerificationEmail,
} from "@/server/auth/actions";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

const unauthenticatedPages = [
	"/login",
	"/verify-email",
	"/signup",
	"/reset-password",
];

export const Route = createFileRoute("/$locale/admin")({
	component: RouteComponent,
	beforeLoad: async ({ params, location, context }) => {
		const { user, session } = context;

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

		if (user?.emailVerified === null) {
			await sendVerificationEmail();
			throw redirect({
				to: "/$locale/admin/verify-email",
				params,
			});
		}

		if (!location.pathname.includes("/onboarding")) {
			const needsOnboarding = await getUserNeedsOnboarding();
			if (needsOnboarding) {
				throw redirect({
					to: "/$locale/admin/onboarding",
					params,
				});
			}
		}

		return { user, session };
	},
});

function RouteComponent() {
	return <Outlet />;
}
