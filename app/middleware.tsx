import {
	defineMiddleware,
	getCookie,
	getHeader,
	getWebRequest,
	sendRedirect,
	setCookie,
} from "vinxi/http";

const languages = ["en", "fr"];
const localizedPaths = [
	{ path: "/", exact: true },
	{ path: "/saved", exact: true },
	{ path: "/resource", exact: false },
];

export default defineMiddleware({
	onRequest: async (event) => {
		const request = getWebRequest(event);
		const pathname = new URL(request.url).pathname;

		console.log("Current pathname:", pathname);
		console.log("Cookie language:", getCookie(event, "language"));
		console.log("Accept-Language:", getHeader(event, "accept-language"));

		const pathnameHasLanguage = languages.some(
			(language) =>
				pathname.startsWith(`/${language}/`) ||
				pathname === `/${language}`,
		);
		if (
			!pathnameHasLanguage &&
			localizedPaths.some(({ path, exact }) =>
				exact ? pathname === path : pathname.startsWith(path),
			)
		) {
			const language = getCookie(event, "language");
			if (language) {
				const redirectUrl = `/${language}${pathname.replace(/\/$/, "")}`;
				console.log("Redirecting to:", redirectUrl);
				return sendRedirect(event, redirectUrl, 302);
			} else {
				const acceptLanguage =
					getHeader(event, "accept-language")?.split(",")[0] || "";
				const language = acceptLanguage?.startsWith("fr") ? "fr" : "en";
				setCookie(event, "language", language);
				const redirectUrl = `/${language}${pathname.replace(/\/$/, "")}`;
				console.log("Redirecting to:", redirectUrl);
				return sendRedirect(event, redirectUrl, 302);
			}
		} else if (pathnameHasLanguage) {
			const language = pathname.split("/")[1];
			setCookie(event, "language", language);
		}
	},
});
