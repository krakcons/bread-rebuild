import { Table } from "@tanstack/react-table";
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/Select";
import { useTranslations } from "use-intl";

interface DataTablePaginationProps<TData> {
	table: Table<TData>;
}

export function DataTablePagination<TData>({
	table,
}: DataTablePaginationProps<TData>) {
	const t = useTranslations();
	return (
		<div className="flex items-center justify-end px-2">
			{/* <div className="flex-1 text-sm text-muted-foreground">
				{table.getFilteredSelectedRowModel().rows.length} of{" "}
				{table.getFilteredRowModel().rows.length} row(s) selected.
			</div> */}
			<div className="flex items-center gap-4">
				<div className="flex items-center gap-2">
					<p className="hidden text-sm font-medium sm:block">
						{t("table.rowsPerPage")}
					</p>
					<Select
						value={`${table.getState().pagination.pageSize}`}
						onValueChange={(value) => {
							table.setPageSize(Number(value));
						}}
					>
						<SelectTrigger className="h-8 w-[70px]">
							<SelectValue
								placeholder={
									table.getState().pagination.pageSize
								}
							/>
						</SelectTrigger>
						<SelectContent side="top">
							{[10, 20, 30, 40, 50].map((pageSize) => (
								<SelectItem
									key={pageSize}
									value={`${pageSize}`}
								>
									{pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex items-center gap-2">
					<div className="flex hidden items-center justify-center text-sm font-medium sm:block">
						{`${t("table.page")} ${table.getState().pagination.pageIndex + 1} ${t("table.of")} ${table.getPageCount()}`}
					</div>
					<div className="flex items-center gap-1">
						<Button
							className="hidden h-8 w-8 p-0 lg:flex"
							onClick={() => table.setPageIndex(0)}
							disabled={!table.getCanPreviousPage()}
						>
							<span className="sr-only">
								{t("table.goToFirstPage")}
							</span>
							<ChevronsLeft />
						</Button>
						<Button
							className="h-8 w-8 p-0"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							<span className="sr-only">
								{t("table.goToPreviousPage")}
							</span>
							<ChevronLeft />
						</Button>
						<Button
							className="h-8 w-8 p-0"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							<span className="sr-only">
								{t("table.goToNextPage")}
							</span>
							<ChevronRight />
						</Button>
						<Button
							className="hidden h-8 w-8 p-0 lg:flex"
							onClick={() =>
								table.setPageIndex(table.getPageCount() - 1)
							}
							disabled={!table.getCanNextPage()}
						>
							<span className="sr-only">
								{t("table.goToLastPage")}
							</span>
							<ChevronsRight />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
