// app/router.tsx
import { getTranslations } from "@/lib/locale";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
export const queryClient = new QueryClient();

export function createRouter() {
	const router = createTanStackRouter({
		routeTree,
		context: {
			session: null,
			user: null,
			provider: null,
			t: getTranslations("en"),
			locale: "en",
		},
		Wrap: ({ children }) => (
			<QueryClientProvider client={queryClient}>
				{children}
			</QueryClientProvider>
		),
	});

	return router;
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createRouter>;
	}
}
