import { Resource } from "@/components/Resource";
import { buttonVariants } from "@/components/ui/Button";
import { useTranslations } from "@/lib/locale";
import { getListingsFn } from "@/server/actions/listings";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/$locale/admin/_admin/listings/list")({
	component: RouteComponent,
	loaderDeps: ({ search }) => search,
	loader: async () => {
		const listings = await getListingsFn();
		return {
			listings,
		};
	},
});

function RouteComponent() {
	const data = Route.useLoaderData();
	const { locale } = Route.useParams();
	const t = useTranslations(locale);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-end justify-between border-b border-gray-200 pb-4">
				<div className="flex flex-col gap-2">
					<h1>{t.admin.listings.title}</h1>
					<p>{t.admin.listings.description}</p>
				</div>
				<Link
					to="/$locale/admin/listings/new"
					from={Route.fullPath}
					resetScroll={false}
					params={(prev) => prev}
					search={(prev) => prev}
					className={buttonVariants()}
				>
					<Plus />
					{t.admin.listings.new.title}
				</Link>
			</div>
			<div className="flex flex-col gap-2">
				{data.listings.length === 0 && (
					<p className="text-muted-foreground">
						{t.admin.listings.empty}
					</p>
				)}
				{data.listings.map((listing) => (
					<Resource key={listing.id} resource={listing} />
				))}
			</div>
		</div>
	);
}