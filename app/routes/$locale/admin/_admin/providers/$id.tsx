import { Contact } from "@/components/Contact";
import { NotFound } from "@/components/NotFound";
import { StatusSelect } from "@/components/Provider/StatusSelect";
import { Resource } from "@/components/Resource";
import { formatPhoneNumber } from "@/lib/phone";
import {
	getProviderFn,
	getProviderListingsFn,
	updateProviderStatusFn,
} from "@/server/actions/provider";
import { createFileRoute, notFound } from "@tanstack/react-router";
import {
	CircleCheck,
	CircleEllipsis,
	CircleX,
	Globe,
	Mail,
	PhoneCall,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/$locale/admin/_admin/providers/$id")({
	component: RouteComponent,
	notFoundComponent: NotFound,
	loader: async ({ params }) => {
		const provider = await getProviderFn({ data: { id: params.id } });
		const listings = await getProviderListingsFn({
			data: { id: params.id },
		});
		if (!provider) {
			throw notFound();
		}
		return { provider, listings };
	},
});

function RouteComponent() {
	const { provider, listings } = Route.useLoaderData();
	const { t } = Route.useRouteContext();
	const [status, setStatus] = useState(provider.status);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-2 border-b border-gray-200 pb-4">
				<h1>{provider.name}</h1>
			</div>
			<div className="flex flex-col gap-2 rounded-lg border bg-white p-4">
				<h2 className="mb-4 text-xl font-bold">
					{t.admin.provider.sections.provider}
				</h2>

				<Contact
					label={t.table.status}
					value={
						<StatusSelect
							defaultValue={provider.status}
							onChange={(status) => {
								setStatus(status);
								updateProviderStatusFn({
									data: {
										id: provider.id,
										status,
									},
								});
							}}
						/>
					}
					icon={
						status === "approved" ? (
							<CircleCheck
								size={20}
								className="text-muted-foreground"
							/>
						) : status === "rejected" ? (
							<CircleX
								size={20}
								className="text-muted-foreground"
							/>
						) : (
							<CircleEllipsis
								size={20}
								className="text-muted-foreground"
							/>
						)
					}
				/>

				<Contact
					label={t.form.common.description}
					value={provider.description}
					icon={
						<CircleEllipsis
							size={20}
							className="text-muted-foreground"
						/>
					}
				/>

				<Contact
					label={t.website}
					value={provider.website}
					link={provider.website}
					icon={<Globe size={20} className="text-muted-foreground" />}
				/>

				{provider.email && (
					<Contact
						label={t.common.email}
						value={provider.email}
						link={`mailto:${provider.email}`}
						icon={
							<Mail size={20} className="text-muted-foreground" />
						}
					/>
				)}

				{provider.phoneNumbers.length > 0 &&
					provider.phoneNumbers.map((phone) => (
						<Contact
							key={phone.phone}
							label={t.phoneTypes[phone.type]}
							value={formatPhoneNumber(phone.phone)}
							link={`tel:${phone.phone}`}
							icon={
								<PhoneCall
									size={20}
									className="text-muted-foreground"
								/>
							}
						/>
					))}
			</div>

			{provider.user && (
				<div className="flex flex-col gap-2 rounded-lg border bg-white p-4">
					<h2 className="mb-4 text-xl font-bold">
						{t.admin.provider.sections.owner}
					</h2>

					<Contact
						label={t.common.email}
						value={provider.user?.email}
						link={`mailto:${provider.user?.email}`}
						icon={
							<Mail size={20} className="text-muted-foreground" />
						}
					/>
				</div>
			)}

			{listings.length > 0 && (
				<div className="flex flex-col gap-2 rounded-lg border bg-white p-4">
					<h2 className="mb-4 text-xl font-bold">
						{t.admin.provider.sections.listings}
					</h2>
					{listings.map((listing) => (
						<div key={listing.id}>
							<Resource resource={listing} />
						</div>
					))}
				</div>
			)}
		</div>
	);
}
