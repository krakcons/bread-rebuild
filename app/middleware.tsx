import { defineMiddleware, getWebRequest } from "vinxi/http";

export default defineMiddleware({
	onRequest: async (event) => {
		const request = getWebRequest(event);
		const locale = request.headers.get("accept-language")?.split(",")[0];
		console.log(locale);
		if (import.meta.env.DEV) {
			const { getPlatformProxy } = await import("wrangler");
			const proxy = await getPlatformProxy<Env>();
			event.context.cloudflare = proxy;
		}
	},
});
