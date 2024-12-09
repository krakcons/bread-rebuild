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
import { getTranslations } from "@/lib/language";
import useSaved from "@/lib/saved";
import { cn } from "@/lib/utils";
import { ResourceType } from "@cords/sdk";
import { useParams } from "@tanstack/react-router";
import { Bookmark, CalendarDays } from "lucide-react";

export const ResourceActions = ({
	resource,
	children,
}: {
	resource: ResourceType;
	children?: React.ReactNode;
}) => {
	const saved = useSaved();
	const { language } = useParams({
		from: "/$language",
	});
	const translations = getTranslations(language);
	return (
		<div
			className="-m-4 flex flex-wrap items-center justify-start gap-2 p-4"
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();
			}}
		>
			{children}
			<button
				onClick={() => {
					saved.toggleSaved(resource.id);
				}}
				className="no-print flex h-9 items-center gap-2 rounded-full border border-gray-300 px-2.5 transition-colors hover:bg-gray-50/50"
			>
				<Bookmark
					size={18}
					className={
						saved.isSaved(resource.id)
							? "fill-primary text-primary"
							: "fill-none"
					}
				/>
				{saved.isSaved(resource.id)
					? translations.saved.saved
					: translations.saved.save}
			</button>
			{saved.isSaved(resource.id) && (
				<Select
					value={saved.getDay(resource.id) ?? undefined}
					onValueChange={(value) => {
						saved.updateDay(resource.id, value);
					}}
				>
					<SelectTrigger
						className={cn(
							"w-auto shrink gap-2",
							saved.getDay(resource.id) ? "" : "no-print",
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
