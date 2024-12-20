/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
	app(input) {
		return {
			name: "bread",
			removal: input?.stage === "production" ? "retain" : "remove",
			home: "aws",
			providers: {
				aws: {
					region: "ca-central-1",
					profile:
						input.stage === "production"
							? "bread-production"
							: "bread-dev",
				},
			},
		};
	},
	async run() {
		const domain =
			$app.stage === "production"
				? "bread.nuonn.com"
				: `bread-dev.nuonn.com`;

		const vpc = new sst.aws.Vpc("BreadVPC", { bastion: true, nat: "ec2" });
		const rds = new sst.aws.Postgres("BreadDB", { vpc, proxy: true });

		const email = new sst.aws.Email("BreadEmail", {
			sender: domain,
		});

		new sst.aws.TanstackStart("Bread", {
			link: [rds, email],
			domain,
			vpc,
			environment: {
				STAGE: $app.stage === "production" ? "production" : "dev",
			},
		});

		new sst.x.DevCommand("Studio", {
			link: [rds],
			dev: {
				command: "drizzle-kit studio",
			},
		});
	},
});
