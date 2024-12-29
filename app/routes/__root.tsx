import globalStyles from "@/index.css?url";
import { getLanguage, languages, setLanguage } from "@/lib/language";
import { SessionValidationResult } from "@/server/auth";
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
		let language = location.pathname.split("/")[1];
		if (!languages.includes(language)) {
			language = await getLanguage();
			throw redirect({
				href: `/${language}${location.pathname}`,
			});
		} else {
			await setLanguage({ data: language as "fr" | "en" });
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
				<Scripts />
			</body>
		</html>
	);
}
