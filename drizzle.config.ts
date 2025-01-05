import { defineConfig } from "drizzle-kit";
import { config } from "./app/server/db";

export default defineConfig({
	dialect: "postgresql",
	schema: ["./app/server/db/schema.ts", "./app/server/db/auth/schema.ts"],
	out: "./migrations",
	dbCredentials: config,
});
