import globalStyles from "@/index.css?url";
import { getTranslations, Locale, locales } from "@/lib/locale";
import { getLocale, setLocale } from "@/lib/locale/actions";
import { Translations } from "@/lib/locale/messages";
import { SessionValidationResult } from "@/server/auth";
import { getAuth } from "@/server/auth/actions";
import {
	createRootRouteWithContext,
	ErrorComponent,
	Outlet,
	redirect,
	ScrollRestoration,
} from "@tanstack/react-router";
import { Meta, Scripts } from "@tanstack/start";
import * as React from "react";

export const Route = createRootRouteWithContext<
	SessionValidationResult & { t: Translations; locale: Locale }
>()({
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
			{
				rel: "preload",
				href: "/fonts/Inter-Variable.ttf",
				as: "font",
				type: "font/ttf",
				crossOrigin: "anonymous",
				fetchPriority: "high",
			},
			{ rel: "stylesheet", href: globalStyles },
			{
				rel: "stylesheet",
				href: "https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css",
			},
		],
	}),
	component: RootComponent,
	errorComponent: ErrorComponent,
	beforeLoad: async ({ location }) => {
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

		// Return context
		return {
			...auth,
			t: getTranslations(locale),
			locale: locale as Locale,
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
	return (
		<html className="overflow-x-hidden">
			<head>
				<Meta />
			</head>
			<body>
				<main className="w-screen p-2 font-[Inter,sans-serif] sm:p-4">
					{children}
				</main>
				<ScrollRestoration getKey={(location) => location.pathname} />
				{/* <ReactQueryDevtools initialIsOpen={false} />
				<TanStackRouterDevtools  /> */}
				<Scripts />
			</body>
		</html>
	);
}
