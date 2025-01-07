import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
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
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { Link, useParams, useRouteContext } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/start";
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
	const toggleSaved = useServerFn(toggleSavedFn);
	const toggleSavedMutation = useMutation({
		mutationFn: () => toggleSaved({ data: { resourceId: resource.id } }),
		onSettled: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["saved"],
			});
		},
	});

	const { locale } = useParams({
		from: "/$locale",
	});
	const translations = useTranslations(locale);
	const savedResource = saved.find(
		(savedResource) => savedResource.resourceId === resource.id,
	);

	let isSaved = savedResource !== undefined;
	isSaved = toggleSavedMutation.isPending ? !isSaved : isSaved;

	const availableDays = days.filter((day) => {
		return resource.hours?.toLowerCase().includes(day.toLowerCase());
	});
	const unavailableDays = days.filter(
		(day) => !resource.hours?.toLowerCase().includes(day.toLowerCase()),
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
				onClick={() => toggleSavedMutation.mutate()}
				className="no-print"
			>
				<Bookmark
					size={18}
					className={
						isSaved ? "fill-primary text-primary" : "fill-none"
					}
				/>
				{isSaved ? translations.saved.saved : translations.saved.save}
			</Button>
			{isSaved && (
				<Select
					value={savedResource?.day ?? "unassigned"}
					onValueChange={async (value) => {
						await updateSavedFn({
							data: {
								resourceId: resource.id,
								day:
									value === "unassigned"
										? null
										: (value as SavedResourceType["day"]),
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
						<SelectValue placeholder={translations.day} />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={"unassigned"}>
							{translations.day}
						</SelectItem>
						<SelectSeparator />
						{availableDays.length > 0 && (
							<SelectGroup>
								<SelectLabel>
									{translations.daysOfWeek.open}
								</SelectLabel>
								{availableDays.map((day) => (
									<SelectItem
										key={day}
										value={day.toLowerCase()}
									>
										{
											translations.daysOfWeek.short[
												day.toLowerCase()
											]
										}
									</SelectItem>
								))}
							</SelectGroup>
						)}
						{unavailableDays.length > 0 && (
							<SelectGroup>
								<SelectLabel>
									{translations.daysOfWeek.closed}
								</SelectLabel>
								{unavailableDays.map((day) => (
									<SelectItem
										key={day}
										value={day.toLowerCase()}
									>
										{
											translations.daysOfWeek.short[
												day.toLowerCase()
											]
										}
									</SelectItem>
								))}
							</SelectGroup>
						)}
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
