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
							? "billyhawkes-production"
							: "billyhawkes-dev",
				},
			},
		};
	},
	async run() {
		new sst.aws.TanstackStart("Bread");
	},
});
