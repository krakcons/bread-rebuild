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
import { toggleSaved, updateDay, useSavedResource } from "@/lib/saved";
import { cn } from "@/lib/utils";
import { ResourceType } from "@cords/sdk";
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
	const saved = useSavedResource(resource.id);
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
			<Button
				onClick={() => {
					toggleSaved(resource.id);
				}}
				className="no-print"
			>
				<Bookmark
					size={18}
					className={
						saved ? "fill-primary text-primary" : "fill-none"
					}
				/>
				{saved ? translations.saved.saved : translations.saved.save}
			</Button>
			{saved && (
				<Select
					value={saved.day ?? undefined}
					onValueChange={(value) => {
						updateDay(resource.id, value);
					}}
				>
					<SelectTrigger
						className={cn(
							"w-auto shrink gap-2",
							saved.day ? "" : "no-print",
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
