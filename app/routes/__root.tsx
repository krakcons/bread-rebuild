import globalStyles from "@/index.css?url";
import { createRootRoute, Outlet, ScrollRestoration } from "@tanstack/react-router";
import { Body, Head, Html, Meta, Scripts } from "@tanstack/start";
import * as React from "react";

export const Route = createRootRoute({
	meta: () => [
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
			content: "Bread is a directory of food resources in the greater Calgary area.",
		},
		{
			name: "icon",
			type: "image/png",
			href: "/favicon.ico",
		},
	],
	links: () => [{ rel: "stylesheet", href: globalStyles }],
	component: RootComponent,
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
		<Html>
			<Head>
				<Meta />
			</Head>
			<Body>
				<main className="relative left-[calc((100vw-100%)/2)] font-[Inter,sans-serif]">
					{children}
				</main>
				<ScrollRestoration />
				<Scripts />
			</Body>
		</Html>
	);
}
