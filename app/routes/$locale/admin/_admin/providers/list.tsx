import { StatusSelect } from "@/components/Provider/StatusSelect";
import { DataTable } from "@/components/ui/DataTable";
import { DataTableColumnHeader } from "@/components/ui/DataTableColumnHeader";
import { Locale, useTranslations } from "@/lib/locale";
import {
	getProvidersFn,
	updateProviderStatusFn,
} from "@/server/actions/provider";
import { createFileRoute } from "@tanstack/react-router";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { z } from "zod";

export const Route = createFileRoute("/$locale/admin/_admin/providers/list")({
	component: RouteComponent,
	validateSearch: z.object({
		globalFilter: z.string().optional(),
		pagination: z
			.object({
				pageIndex: z.number().default(0),
				pageSize: z.number().default(10),
			})
			.optional(),
		sorting: z
			.array(z.object({ id: z.string(), desc: z.boolean() }))
			.optional(),
	}),
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
						className="min-w-[200px]"
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
						<div
							className="-m-2 p-2"
							onClick={(e) => e.stopPropagation()}
						>
							<StatusSelect
								defaultValue={row.original.status}
								onChange={(status) => {
									updateProviderStatusFn({
										data: {
											id: row.original.id,
											status,
										},
									});
								}}
							/>
						</div>
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
	const navigate = Route.useNavigate();
	const {
		pagination = { pageIndex: 0, pageSize: 10 },
		sorting = [],
		globalFilter = "",
	} = Route.useSearch();

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
					email: Array.from(
						new Set([provider.email, provider.user?.email]),
					)
						.filter(Boolean)
						.join(", "),
					status: provider.status,
				}))}
				onRowClick={(row) => {
					navigate({
						to: "/$locale/admin/providers/$id",
						params: (prev) => ({
							...prev,
							id: row.id,
						}),
						search: (prev) => prev,
					});
				}}
				sorting={sorting}
				pagination={pagination}
				globalFilter={globalFilter}
				setGlobalFilter={(globalFilter) => {
					navigate({
						search: (search) => ({ ...search, globalFilter }),
					});
				}}
				setSorting={(sorting) => {
					// Update sorting and reset page
					navigate({
						params: (prev) => ({ ...prev }),
						search: (search) => ({
							...search,
							sorting,
							pagination: {
								...search.pagination,
								pageIndex: 0,
							},
						}),
					});
				}}
				setPagination={(pagination) => {
					// Update pagination
					navigate({
						params: (prev) => ({ ...prev }),
						search: (search) => ({ ...search, pagination }),
					});
				}}
			/>
		</div>
	);
}
