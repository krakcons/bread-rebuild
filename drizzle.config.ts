import { defineConfig } from "drizzle-kit";
import { Resource } from "sst";

export default defineConfig({
	dialect: "postgresql",
	schema: ["./app/server/db/schema.ts"],
	out: "./migrations",
	dbCredentials: {
		host: Resource.BreadDB.host,
		port: Resource.BreadDB.port,
		user: Resource.BreadDB.username,
		password: Resource.BreadDB.password,
		database: Resource.BreadDB.database,
	},
});
