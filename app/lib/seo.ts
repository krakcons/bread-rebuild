export type Seo = {
	title: string;
	description?: string;
	image?: string;
	keywords?: string;
};

export const seo = ({
	title,
	description,
	keywords,
	image = "/og-image.png",
}: Seo) => {
	const meta = [
		{ title },
		{ name: "description", content: description },
		{ name: "keywords", content: keywords },
		{ name: "twitter:title", content: title },
		{ name: "twitter:description", content: description },
		{ name: "og:type", content: "website" },
		{ name: "og:title", content: title },
		{ name: "og:description", content: description },
		...(image
			? [
					{ name: "twitter:image", content: image },
					{ name: "twitter:card", content: "summary_large_image" },
					{ name: "og:image", content: image },
				]
			: []),
	];

	return { meta };
};