import globalStyles from "@/index.css?url";
import { Locale, locales } from "@/lib/locale";
import { getLocale, setLocale } from "@/lib/locale/actions";
import { i18nQueryOptions } from "@/lib/locale/query";
import { queryClient } from "@/router";
import { SessionValidationResult } from "@/server/auth";
import { getAuth } from "@/server/auth/actions";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	ErrorComponent,
	Outlet,
	redirect,
	ScrollRestoration,
	useParams,
} from "@tanstack/react-router";
import { Meta, Scripts } from "@tanstack/start";
import * as React from "react";
import { createTranslator, IntlProvider } from "use-intl";

export const Route = createRootRouteWithContext<SessionValidationResult>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Bread: Food Banks in Calgary",
			},
			{
				name: "description",
				content:
					"Bread is a directory of food resources in the greater Calgary area.",
			},
			{
				name: "icon",
				type: "image/png",
				href: "/favicon.ico",
			},
		],
		links: [
			{ rel: "stylesheet", href: globalStyles },
			{
				rel: "stylesheet",
				href: "https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css",
			},
		],
	}),
	component: RootComponent,
	errorComponent: ErrorComponent,
	beforeLoad: async ({ location, context }) => {
		// Handle locale
		let locale = location.pathname.split("/")[1];
		if (!locales.some(({ value }) => value === locale)) {
			locale = await getLocale();
			throw redirect({
				href: `/${locale}${location.pathname}`,
			});
		} else {
			await setLocale({ data: locale as Locale });
		}

		// Handle auth
		const auth = await getAuth();

		const i18n = await queryClient.ensureQueryData(
			i18nQueryOptions(locale as Locale),
		);
		const t = await createTranslator(i18n);

		// Return context
		return {
			...context,
			...auth,
			t,
		};
	},
});

function RootComponent() {
	return (
		<RootDocument>
			<Outlet />
		</RootDocument>
	);
}

function RootDocument({ children }: { children: React.ReactNode }) {
	const { locale } = useParams({
		from: "/$locale",
	});
	const { data: i18n } = useSuspenseQuery(i18nQueryOptions(locale as Locale));

	return (
		<html
			className="overflow-x-hidden"
			lang={locale}
			suppressHydrationWarning
		>
			<head>
				<Meta />
			</head>
			<body>
				<main className="w-screen p-2 font-[Inter,sans-serif] sm:p-4">
					<IntlProvider {...i18n}>{children}</IntlProvider>
				</main>
				<ScrollRestoration getKey={(location) => location.pathname} />
				{/* <ReactQueryDevtools initialIsOpen={false} />
				<TanStackRouterDevtools  /> */}
				<Scripts />
			</body>
		</html>
	);
}
