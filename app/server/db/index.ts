import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { Resource } from "sst";
import * as schema from "./schema";

if (!process.env.TENANT_STAGE_NAME) {
	throw new Error("TENANT_STAGE_NAME is not set");
}

export const config = {
	host: Resource.RDS.host,
	port: Resource.RDS.port,
	user: Resource.RDS.username,
	password: Resource.RDS.password,
	database: process.env.TENANT_STAGE_NAME,
	ssl: {
		rejectUnauthorized: false,
	},
} satisfies pg.PoolConfig;

const pool = new pg.Pool(config);

export const db = drizzle(pool, { schema });
