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
import { getTranslations } from "@/lib/locale";
import { cn } from "@/lib/utils";
import { queryClient } from "@/router";
import {
	getSavedFn,
	toggleSavedFn,
	updateSavedFn,
} from "@/server/actions/saved";
import { ResourceType, SavedResourceType } from "@/server/types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { Bookmark, CalendarDays } from "lucide-react";
import { Button } from "../ui/Button";

export const ResourceActions = ({
	resource,
	children,
}: {
	resource: ResourceType;
	children?: React.ReactNode;
}) => {
	const { data: saved } = useSuspenseQuery({
		queryKey: ["saved"],
		queryFn: () => getSavedFn(),
	});

	const { locale } = useParams({
		from: "/$locale",
	});
	const translations = getTranslations(locale);
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
								<SelectItem key={day} value={day}>
									{day}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
			)}
		</div>
	);
};
