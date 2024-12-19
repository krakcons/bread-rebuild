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
		const vpc = new sst.aws.Vpc("bread-vpc", { bastion: true, nat: "ec2" });
		const rds = new sst.aws.Postgres("bread-db", { vpc, proxy: true });

		new sst.aws.TanstackStart("Bread", {
			link: [rds],
			domain: "bread.nuonn.com",
			vpc,
		});

		new sst.x.DevCommand("Studio", {
			link: [rds],
			dev: {
				command: "npx drizzle-kit studio",
			},
		});
	},
});
