"use client";

import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
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
import { cn } from "@/lib/utils";
import { DataTablePagination } from "./DataTablePagination";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	onRowClick?: (row: TData) => void;
	sorting: SortingState;
	pagination: PaginationState;
	setSorting: (sorting: SortingState) => void;
	setPagination: (pagination: PaginationState) => void;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	onRowClick,
	sorting,
	pagination,
	setSorting,
	setPagination,
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
		autoResetPageIndex: false,
		state: {
			sorting,
			pagination,
		},
	});

	return (
		<div className="rounded-md border">
			<Table>
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
								No results.
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
