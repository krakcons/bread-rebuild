import {
	getAuth,
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

export const Route = createFileRoute("/$language/admin")({
	component: RouteComponent,
	beforeLoad: async ({ params, location }) => {
		const { user, session } = await getAuth();

		if (
			user === null &&
			// Dont redirect to login if user is already on an unauthenticated page
			!unauthenticatedPages.some((path) =>
				location.pathname.includes(path),
			)
		) {
			throw redirect({
				to: "/$language/admin/login",
				params,
			});
		}

		if (user?.emailVerified === null) {
			await sendVerificationEmail();
			throw redirect({
				to: "/$language/admin/verify-email",
				params,
			});
		}

		if (!location.pathname.includes("/onboarding")) {
			const needsOnboarding = await getUserNeedsOnboarding();
			if (needsOnboarding) {
				throw redirect({
					to: "/$language/admin/onboarding",
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
