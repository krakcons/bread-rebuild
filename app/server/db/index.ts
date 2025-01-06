import * as schema from "@/server/db/schema";
import { drizzle } from "drizzle-orm/aws-data-api/pg";
import { Resource } from "sst";

if (!process.env.TENANT_STAGE_NAME) {
	throw new Error("TENANT_STAGE_NAME is not set");
}

export const db = drizzle({
	connection: {
		region: "ca-central-1",
		database: process.env.TENANT_STAGE_NAME!,
		secretArn: Resource.Aurora.secretArn,
		resourceArn: Resource.Aurora.clusterArn,
	},
	schema,
});
