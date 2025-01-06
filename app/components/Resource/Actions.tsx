import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/Select";
import { days } from "@/lib/hours";
import { useTranslations } from "@/lib/locale";
import { cn } from "@/lib/utils";
import { queryClient } from "@/router";
import {
	getSavedFn,
	toggleSavedFn,
	updateSavedFn,
} from "@/server/actions/saved";
import { ResourceType, SavedResourceType } from "@/server/db/types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useParams, useRouteContext } from "@tanstack/react-router";
import { Bookmark, CalendarDays, Edit } from "lucide-react";
import { Button, buttonVariants } from "../ui/Button";

export const ResourceActions = ({
	resource,
	children,
}: {
	resource: ResourceType;
	children?: React.ReactNode;
}) => {
	const { providerId } = useRouteContext({
		from: "__root__",
	});
	const { data: saved } = useSuspenseQuery({
		queryKey: ["saved"],
		queryFn: () => getSavedFn(),
	});

	const { locale } = useParams({
		from: "/$locale",
	});
	const translations = useTranslations(locale);
	const savedResource = saved.find(
		(savedResource) => savedResource.resourceId === resource.id,
	);

	return (
		<div
			className="-m-4 flex flex-wrap items-center justify-start gap-2 p-4"
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();
			}}
		>
			{children}
			<Button
				onClick={async () => {
					await toggleSavedFn({ data: { resourceId: resource.id } });
					await queryClient.invalidateQueries({
						queryKey: ["saved"],
					});
				}}
				className="no-print"
			>
				<Bookmark
					size={18}
					className={
						savedResource
							? "fill-primary text-primary"
							: "fill-none"
					}
				/>
				{savedResource
					? translations.saved.saved
					: translations.saved.save}
			</Button>
			{savedResource && (
				<Select
					value={
						savedResource.day !== "unassigned"
							? savedResource.day
							: undefined
					}
					onValueChange={async (value) => {
						await updateSavedFn({
							data: {
								resourceId: resource.id,
								day: value as SavedResourceType["day"],
							},
						});
						await queryClient.invalidateQueries({
							queryKey: ["saved"],
						});
					}}
				>
					<SelectTrigger
						className={cn(
							"w-auto shrink gap-2",
							savedResource?.day ? "" : "no-print",
						)}
					>
						<CalendarDays size={18} />
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{/* @ts-expect-error */}
						<SelectItem value={undefined}>
							{translations.day}
						</SelectItem>
						<SelectSeparator />
						<SelectGroup>
							{days.map((day) => (
								<SelectItem key={day} value={day.toLowerCase()}>
									{
										translations.daysOfWeek.short[
											day.toLowerCase()
										]
									}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
			)}
			{providerId === resource.provider.id && (
				<Link
					to="/$locale/admin/listings/$id"
					onClick={(e) => {
						e.stopPropagation();
					}}
					params={{
						id: resource.id,
						locale,
					}}
					search={(prev) => ({
						editingLocale: prev.editingLocale,
					})}
					className={buttonVariants()}
				>
					<Edit />
					{translations.edit}
				</Link>
			)}
		</div>
	);
};
