import {
	defineMiddleware,
	getCookie,
	getHeader,
	getWebRequest,
	sendRedirect,
	setCookie,
} from "vinxi/http";

const languages = ["en", "fr"];
const localizedPaths = ["/"];

export default defineMiddleware({
	onRequest: async (event) => {
		const request = getWebRequest(event);
		const pathname = new URL(request.url).pathname;
		console.log("pathname", pathname);

		const pathnameHasLanguage = languages.some(
			(language) => pathname.startsWith(`/${language}/`) || pathname === `/${language}`
		);
		if (!pathnameHasLanguage && localizedPaths.includes(pathname)) {
			const language = getCookie(event, "language");
			if (language) {
				console.log("language", language, pathname);
				sendRedirect(event, `/${language}${pathname.replace(/\/$/, "")}`);
			} else {
				const acceptLanguage = getHeader(event, "accept-language")?.split(",")[0];
				const language = acceptLanguage?.startsWith("fr") ? "fr" : "en";
				setCookie(event, "language", language);
				sendRedirect(event, `/${language}${pathname.replace(/\/$/, "")}`);
			}
		} else if (pathnameHasLanguage) {
			const language = pathname.split("/")[1];
			console.log("pathnameHasLanguage", pathname, language);
			setCookie(event, "language", language);
		}

		if (import.meta.env.DEV) {
			const { getPlatformProxy } = await import("wrangler");
			const proxy = await getPlatformProxy<Env>();
			event.context.cloudflare = proxy;
		}
	},
});
