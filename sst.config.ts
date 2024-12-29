/// <reference path="./.sst/platform/config.d.ts" />
const tenant = "bread";
const profile = "krak";
const stageMap = new Map<string, { name: string; domain: string }>([
	["prod", { name: `${tenant}-prod`, domain: `${tenant}-prod.nuonn.com` }],
	["dev", { name: `${tenant}-dev`, domain: `${tenant}-dev.nuonn.com` }],
	[
		"billyhawkes",
		{
			name: `${tenant}-billyhawkes`,
			domain: `${tenant}-billyhawkes.nuonn.com`,
		},
	],
]);

export default $config({
	app(input) {
		return {
			name: tenant,
			removal: input?.stage === "prod" ? "retain" : "remove",
			home: "aws",
			providers: {
				aws: {
					// Region for all resources (restrict to Canada)
					region: "ca-central-1",
					// Under main account
					profile,
				},
				cloudflare: true,
			},
		};
	},
	async run() {
		let stage = stageMap.get($app.stage);
		// Personal stage
		if (!stage) {
			throw new Error(`Stage ${$app.stage} not found`);
		}
		const { name, domain } = stage;

		// Multi-tenant resources
		const vpc = sst.aws.Vpc.get("Vpc", "vpc-08c28b23ee20f3975");
		const rds = sst.aws.Postgres.get("RDS", {
			id: "krak-prod-rdsinstance",
		});

		const environment = {
			TENANT_STAGE_NAME: name,
		};

		const dns = sst.cloudflare.dns({
			proxy: true,
		});

		// Per-tenant resources
		const email = new sst.aws.Email("Email", {
			sender: domain,
			dns,
		});
		new sst.aws.TanstackStart("Web", {
			link: [rds, email],
			domain: {
				name: domain,
				dns,
			},
			vpc,
			environment,
		});

		// Dev commands
		new sst.x.DevCommand("Studio", {
			link: [rds],
			dev: {
				command: "drizzle-kit studio",
			},
			environment,
		});

		return {
			database: $interpolate`postgres://${rds.username}:${rds.password}@${rds.host}:${rds.port}/${rds.database}`,
		};
	},
});
