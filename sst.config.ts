/// <reference path="./.sst/platform/config.d.ts" />

const tenant = "bread";
const profile = "krak";

const stageMap = new Map<
	string,
	{ name: string; domain: string; siteUrl: string }
>([
	[
		"prod",
		{
			name: `${tenant}-prod`,
			domain: `${tenant}-prod.nuonn.com`,
			siteUrl: `https://${tenant}-prod.nuonn.com`,
		},
	],
	[
		"dev",
		{
			name: `${tenant}-dev`,
			domain: `${tenant}-dev.nuonn.com`,
			siteUrl: `https://${tenant}-dev.nuonn.com`,
		},
	],
	[
		"billyhawkes",
		{
			name: `${tenant}-billyhawkes`,
			domain: `${tenant}-billyhawkes.nuonn.com`,
			siteUrl: "http://localhost:3000",
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
		if (!stage) {
			throw new Error(`Stage ${$app.stage} not found`);
		}
		const { name, domain, siteUrl } = stage;

		// Multi-tenant resources
		const vpc = sst.aws.Vpc.get("Vpc", "vpc-08c28b23ee20f3975");
		const aurora = sst.aws.Aurora.get("Aurora", "krak-prod-auroracluster");

		const environment = {
			TENANT_STAGE_NAME: name,
			SITE_URL: siteUrl,
		};

		const dns = sst.cloudflare.dns({
			proxy: true,
		});

		// Per-tenant resources
		const email = new sst.aws.Email("Email", {
			sender: domain,
			dns,
		});
		const GOOGLE_MAPS_API_KEY = new sst.Secret("GOOGLE_MAPS_API_KEY");
		new sst.aws.TanstackStart("Web", {
			link: [aurora, email, GOOGLE_MAPS_API_KEY],
			domain: {
				name: domain,
				dns,
			},
			vpc,
			environment,
		});

		// Dev commands
		new sst.x.DevCommand("Studio", {
			link: [aurora],
			dev: {
				command: "drizzle-kit studio",
			},
			environment,
		});

		return {
			database: $interpolate`postgres://${aurora.username}:${aurora.password}@${aurora.host}:${aurora.port}/${aurora.database}`,
		};
	},
});
