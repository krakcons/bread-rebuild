import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { Resource } from "sst";
import * as schema from "./schema";

const pool = new pg.Pool({
	host: Resource.BreadDB.host,
	port: Resource.BreadDB.port,
	user: Resource.BreadDB.username,
	password: Resource.BreadDB.password,
	database: Resource.BreadDB.database,
});

export const db = drizzle(pool, { schema });
