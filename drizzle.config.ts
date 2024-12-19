import { defineConfig } from "drizzle-kit";
import { Resource } from "sst";

export default defineConfig({
	dialect: "postgresql",
	schema: ["./app/server/db/schema.ts"],
	out: "./migrations",
	dbCredentials: {
		host: Resource["bread-db"].host,
		port: Resource["bread-db"].port,
		user: Resource["bread-db"].username,
		password: Resource["bread-db"].password,
		database: Resource["bread-db"].database,
	},
});
