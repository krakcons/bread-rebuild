import { DataTable } from "@/components/ui/DataTable";
import { DataTableColumnHeader } from "@/components/ui/DataTableColumnHeader";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/Select";
import { Locale, useTranslations } from "@/lib/locale";
import {
	getProvidersFn,
	updateProviderStatusFn,
} from "@/server/actions/provider";
import { createFileRoute } from "@tanstack/react-router";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

export const Route = createFileRoute("/$locale/admin/_admin/providers")({
	component: RouteComponent,
	loader: async ({ params }) => {
		const providers = await getProvidersFn({
			data: { locale: params.locale as Locale },
		});
		return { providers };
	},
});

const useColumns = () => {
	const { locale } = Route.useParams();
	const t = useTranslations(locale);
	const columns: ColumnDef<{
		id: string;
		name: string;
		email: string;
		status: "pending" | "approved" | "rejected";
	}>[] = useMemo(
		() => [
			{
				header: ({ column }) => (
					<DataTableColumnHeader
						column={column}
						title={t.admin.providers.table.name}
					/>
				),
				accessorKey: "name",
			},
			{
				header: ({ column }) => (
					<DataTableColumnHeader
						column={column}
						title={t.admin.providers.table.email}
					/>
				),
				accessorKey: "email",
			},
			{
				header: ({ column }) => (
					<DataTableColumnHeader
						column={column}
						title={t.admin.providers.table.status}
					/>
				),
				accessorKey: "status",
				cell: ({ row }) => {
					return (
						<Select
							defaultValue={row.original.status}
							onValueChange={(value) => {
								updateProviderStatusFn({
									data: {
										id: row.original.id,
										status: value as
											| "pending"
											| "approved"
											| "rejected",
									},
								});
							}}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="pending">Pending</SelectItem>
								<SelectItem value="approved">
									Approved
								</SelectItem>
								<SelectItem value="rejected">
									Rejected
								</SelectItem>
							</SelectContent>
						</Select>
					);
				},
			},
		],
		[locale],
	);
	return columns;
};

function RouteComponent() {
	const { providers } = Route.useLoaderData();
	const { locale } = Route.useParams();
	const t = useTranslations(locale);
	const columns = useColumns();

	return (
		<div className="flex flex-col gap-4">
			<div className="mb-4 flex flex-col gap-2 border-b border-gray-200 pb-4">
				<h1>{t.admin.providers.title}</h1>
				<p>{t.admin.providers.description}</p>
			</div>
			<DataTable
				columns={columns}
				data={providers.map((provider) => ({
					id: provider.id,
					name: provider.name,
					email: provider.user?.email ?? provider.email,
					status: provider.status,
				}))}
			/>
		</div>
	);
}
