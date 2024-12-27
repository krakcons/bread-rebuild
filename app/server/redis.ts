import { Cluster } from "ioredis";
import { Resource } from "sst";

export const redis = new Cluster(
	[
		{
			host: Resource.Redis.host,
			port: Resource.Redis.port,
		},
	],
	{
		redisOptions: {
			tls: { checkServerIdentity: () => undefined },
			username: Resource.Redis.username,
			password: Resource.Redis.password,
			keyPrefix: `${process.env.TENANT_STAGE_NAME}:`,
		},
	},
);
