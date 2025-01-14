import { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/Button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { cn } from "@/lib/utils";
import { useRouteContext } from "@tanstack/react-router";

interface DataTableColumnHeaderProps<TData, TValue>
	extends React.HTMLAttributes<HTMLDivElement> {
	column: Column<TData, TValue>;
	title: string;
}

export function DataTableColumnHeader<TData, TValue>({
	column,
	title,
	className,
}: DataTableColumnHeaderProps<TData, TValue>) {
	if (!column.getCanSort()) {
		return <div className={cn(className)}>{title}</div>;
	}
	const { t } = useRouteContext({
		from: "__root__",
	});
	console.log(column.getIsSorted());

	return (
		<div className={cn("flex items-center space-x-2", className)}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						size="sm"
						className="-ml-3 h-8 data-[state=open]:bg-accent"
					>
						<span className="text-sm">{title}</span>
						{column.getIsSorted() === "desc" ? (
							<ArrowDown />
						) : column.getIsSorted() === "asc" ? (
							<ArrowUp />
						) : (
							<ChevronsUpDown />
						)}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start">
					<DropdownMenuItem
						onClick={() => column.toggleSorting(false)}
					>
						<ArrowUp className="h-3.5 w-3.5 text-muted-foreground/70" />
						{t.table.sort.asc}
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => column.toggleSorting(true)}
					>
						<ArrowDown className="h-3.5 w-3.5 text-muted-foreground/70" />
						{t.table.sort.desc}
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={() => column.toggleVisibility(false)}
					>
						<EyeOff className="h-3.5 w-3.5 text-muted-foreground/70" />
						{t.table.sort.hide}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
