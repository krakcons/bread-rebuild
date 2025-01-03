import globalStyles from "@/index.css?url";
import { Locale, locales } from "@/lib/locale";
import { getLocale, setLocale } from "@/lib/locale/actions";
import { SessionValidationResult } from "@/server/auth";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
	createRootRouteWithContext,
	ErrorComponent,
	Outlet,
	redirect,
	ScrollRestoration,
} from "@tanstack/react-router";
import { Meta, Scripts } from "@tanstack/start";
import * as React from "react";

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
	beforeLoad: async ({ location }) => {
		let locale = location.pathname.split("/")[1];
		if (!locales.some(({ value }) => value === locale)) {
			locale = await getLocale();
			throw redirect({
				href: `/${locale}${location.pathname}`,
			});
		} else {
			await setLocale({ data: locale as Locale });
		}
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
		<html>
			<head>
				<Meta />
			</head>
			<body>
				<main className="font-[Inter,sans-serif]">{children}</main>
				<ScrollRestoration />
				<ReactQueryDevtools initialIsOpen={false} />
				<Scripts />
			</body>
		</html>
	);
}
