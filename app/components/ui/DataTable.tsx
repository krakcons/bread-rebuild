"use client";

import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	PaginationState,
	SortingState,
	useReactTable,
} from "@tanstack/react-table";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/Table";
import { useTranslations } from "@/lib/locale";
import { cn } from "@/lib/utils";
import { useParams } from "@tanstack/react-router";
import { DataTablePagination } from "./DataTablePagination";
import { Input } from "./Input";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	onRowClick?: (row: TData) => void;
	sorting: SortingState;
	pagination: PaginationState;
	setSorting: (sorting: SortingState) => void;
	setPagination: (pagination: PaginationState) => void;
	globalFilter: string;
	setGlobalFilter: (globalFilter: string) => void;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	onRowClick,
	sorting,
	pagination,
	setSorting,
	setPagination,
	globalFilter,
	setGlobalFilter,
}: DataTableProps<TData, TValue>) {
	const table = useReactTable({
		data,
		columns,
		onPaginationChange: (updater) => {
			const newPagination =
				typeof updater === "function" ? updater(pagination) : updater;
			if (
				pagination.pageIndex === newPagination.pageIndex &&
				pagination.pageSize === newPagination.pageSize
			) {
				return;
			}
			setPagination(newPagination);
		},
		onSortingChange: (updater) => {
			const newSorting =
				typeof updater === "function" ? updater(sorting) : updater;
			if (
				sorting.length === newSorting.length &&
				sorting.every((s, i) => s.id === newSorting[i]?.id)
			) {
				return;
			}
			setSorting(newSorting);
		},
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onGlobalFilterChange: (updater) => {
			const newGlobalFilter =
				typeof updater === "function" ? updater(globalFilter) : updater;
			setGlobalFilter(newGlobalFilter);
		},
		getFilteredRowModel: getFilteredRowModel(),
		autoResetPageIndex: false,
		state: {
			sorting,
			pagination,
			globalFilter,
		},
	});

	const { locale } = useParams({
		from: "/$locale",
	});
	const t = useTranslations(locale);

	return (
		<div className="rounded-md">
			<div className="flex items-center py-4">
				<Input
					placeholder={t.admin.providers.table.filter}
					defaultValue={globalFilter}
					onChange={(event) => setGlobalFilter(event.target.value)}
					className="max-w-sm"
				/>
			</div>
			<Table className="border">
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id} className="p-4">
							{headerGroup.headers.map((header) => {
								return (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef
														.header,
													header.getContext(),
												)}
									</TableHead>
								);
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody className="px-2">
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								data-state={row.getIsSelected() && "selected"}
								onClick={() => {
									if (onRowClick) {
										onRowClick(row.original);
									}
								}}
								className={cn(onRowClick && "cursor-pointer")}
							>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(
											cell.column.columnDef.cell,
											cell.getContext(),
										)}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell
								colSpan={columns.length}
								className="h-24 text-center"
							>
								{t.admin.providers.table.empty}
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
			<div className="p-2">
				<DataTablePagination table={table} />
			</div>
		</div>
	);
}
