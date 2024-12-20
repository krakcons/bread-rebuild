import { defineConfig } from "@tanstack/start/config";
import { App } from "vinxi";
import viteTsConfigPaths from "vite-tsconfig-paths";

const tanstackApp = defineConfig({
	server: {
		preset: "aws-lambda",
	},
	vite: {
		plugins: [
			viteTsConfigPaths({
				projects: ["./tsconfig.json"],
			}),
		],
	},
});

const routers = tanstackApp.config.routers.map((r) => {
	return {
		...r,
		middleware: r.target === "server" ? "./app/middleware.tsx" : undefined,
	};
});

const app: App = {
	...tanstackApp,
	config: {
		...tanstackApp.config,
		routers: routers,
	},
};

export default app;
