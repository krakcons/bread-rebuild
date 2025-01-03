import { Resource } from "@/components/Resource";
import { buttonVariants } from "@/components/ui/Button";
import { getListingsFn } from "@/server/actions/listings";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";

const english = {
	title: "Listings",
	description: "Manage your listings here.",
	empty: "No listings found.",
};

const french: typeof english = {
	title: "Listings",
	description: "Gérez vos listings ici.",
	empty: "Aucun listing trouvé.",
};

export const Route = createFileRoute("/$locale/admin/_admin/listings/")({
	component: RouteComponent,
	loaderDeps: ({ search }) => search,
	loader: async ({ params, deps: { editingLocale } }) => {
		const listings = await getListingsFn();
		return {
			pt: params.locale === "fr" ? french : english,
			listings,
		};
	},
});

function RouteComponent() {
	const { pt, listings } = Route.useLoaderData();

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-end justify-between border-b border-gray-200 pb-4">
				<div className="flex flex-col gap-2">
					<h1>{pt.title}</h1>
					<p>{pt.description}</p>
				</div>
				<Link
					to="/$locale/admin/listings/new"
					from={Route.fullPath}
					params={(prev) => prev}
					search={(prev) => prev}
					className={buttonVariants()}
				>
					<Plus />
					Add Listing
				</Link>
			</div>
			<div className="flex flex-col gap-2">
				{listings.length === 0 && (
					<p className="text-muted-foreground">{pt.empty}</p>
				)}
				{listings.map((listing) => (
					<Resource key={listing.id} resource={listing} />
				))}
			</div>
		</div>
	);
}
