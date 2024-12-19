import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { Resource } from "sst";
import * as schema from "./schema";

const pool = new Pool({
	host: Resource["bread-db"].host,
	port: Resource["bread-db"].port,
	user: Resource["bread-db"].username,
	password: Resource["bread-db"].password,
	database: Resource["bread-db"].database,
});

export const db = drizzle(pool, { schema });
