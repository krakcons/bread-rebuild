import { ListingForm } from "@/components/forms/Listing";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/AlertDialog";
import { Button } from "@/components/ui/Button";
import { deleteListingFn, mutateListingFn } from "@/server/actions/listings";
import { getResourceFn } from "@/server/actions/resource";
import {
	createFileRoute,
	ErrorComponent,
	Link,
	notFound,
	useRouter,
} from "@tanstack/react-router";
import { useServerFn } from "@tanstack/start";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/$locale/admin/_admin/listings/$id")({
	component: RouteComponent,
	errorComponent: ErrorComponent,
	loaderDeps: ({ search }) => ({ editingLocale: search.editingLocale }),
	loader: async ({ params, deps }) => {
		const listing = await getResourceFn({
			data: {
				id: params.id,
				locale: deps.editingLocale,
				fallback: false,
			},
		});
		if (!listing) {
			throw notFound();
		}
		return { listing };
	},
});

function RouteComponent() {
	const router = useRouter();
	const { id } = Route.useParams();
	const { listing } = Route.useLoaderData();
	const updateListing = useServerFn(mutateListingFn);
	const deleteListing = useServerFn(deleteListingFn);
	const { editingLocale } = Route.useSearch();
	const { t, locale } = Route.useRouteContext();
	const [deleting, setDeleting] = useState(false);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-end justify-between gap-4 border-b border-gray-200 pb-4">
				<div className="flex flex-col gap-2">
					<h1>{t.admin.listings.edit.title}</h1>
					<p>{t.admin.listings.edit.description}</p>
				</div>
				<div className="flex items-center gap-2">
					<AlertDialog open={deleting} onOpenChange={setDeleting}>
						<AlertDialogTrigger asChild>
							<Button variant="destructive">
								{t.form.listing.delete.title}
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									{t.form.listing.delete.title}
								</AlertDialogTitle>
								<AlertDialogDescription>
									{t.form.listing.delete.description}
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>
									{t.form.listing.delete.cancel}
								</AlertDialogCancel>
								<AlertDialogAction
									onClick={async () => {
										await deleteListing({
											data: { id },
										});
									}}
								>
									{t.form.listing.delete.confirm}
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
					<Link
						to="/$locale/resources/$id"
						params={{ id: listing?.id!, locale }}
						className="flex items-center gap-2"
					>
						<Button>{t.preview}</Button>
					</Link>
				</div>
			</div>
			<div className="flex flex-col gap-2">
				<ListingForm
					key={`${editingLocale}-${listing?.updatedAt.toString()}`}
					locale={locale}
					provider={listing?.provider!}
					defaultValues={listing}
					onSubmit={async (data) => {
						await updateListing({
							data: {
								...data,
								id,
								redirect: false,
								locale: editingLocale!,
							},
						});
						await toast.success(t.form.listing.success.update);
						await router.invalidate();
					}}
					blockNavigation={!deleting}
				/>
			</div>
		</div>
	);
}
