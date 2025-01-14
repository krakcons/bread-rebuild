import { Search, SlidersHorizontal, Utensils } from "lucide-react";

import { useDebounce } from "@/lib/debounce";
import { filterIcons } from "@/lib/search";
import { SearchFormSchema } from "@/server/actions/resource";
import { DietaryOptionSchema } from "@/server/types";
import { useForm, useStore } from "@tanstack/react-form";
import { useEffect, useState } from "react";
import { useTranslations } from "use-intl";
import { z } from "zod";
import { Button } from "../ui/Button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "../ui/Dialog";
import { Input } from "../ui/Input";

const SearchForm = ({
	hide = {
		filters: true,
		submit: true,
		query: false,
	},
	defaultValues,
	onSubmit,
}: {
	onSubmit: (values: z.infer<typeof SearchFormSchema>) => void;
	hide?: {
		filters?: boolean;
		submit?: boolean;
		query?: boolean;
	};
	defaultValues?: z.infer<typeof SearchFormSchema>;
}) => {
	const t = useTranslations();
	const [dialogOpen, setDialogOpen] = useState(false);

	const form = useForm({
		defaultValues: defaultValues ?? {
			query: "",
			free: false,
			preparation: false,
			parking: false,
			transit: false,
			wheelchair: false,
			dietaryOptions: [],
		},
		onSubmit: async ({ value }) => {
			onSubmit({
				query: value.query || undefined,
				free: value.free || undefined,
				preparation: value.preparation || undefined,
				parking: value.parking || undefined,
				transit: value.transit || undefined,
				wheelchair: value.wheelchair || undefined,
				dietaryOptions:
					value.dietaryOptions && value.dietaryOptions.length > 0
						? value.dietaryOptions
						: undefined,
			});
		},
	});

	const numberOfFiltersOn = useStore(form.store, (state) => {
		const { query, ...filters } = state.values;
		return Object.values(filters).filter(
			(value) =>
				(typeof value === "boolean" && value) ||
				(Array.isArray(value) && value.length > 0),
		).length;
	});

	const query = useStore(form.store, (state) => state.values.query);
	const debouncedQuery = useDebounce(query, 300);

	useEffect(() => {
		if (hide?.submit) {
			form.handleSubmit();
		}
	}, [debouncedQuery]);

	const FilterButtons = () => (
		<>
			{Object.keys(filterIcons).map((name) => (
				<form.Field
					key={name}
					listeners={{
						onChange: () => {
							if (hide?.submit) {
								form.handleSubmit();
							}
						},
					}}
					name={name as keyof typeof filterIcons}
					children={(field) => (
						<Button
							key={name}
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								field.handleChange(!field.state.value);
							}}
							active={field.state.value}
							className="justify-start"
						>
							{filterIcons[name as keyof typeof filterIcons]}
							{t(`filters.${name as keyof typeof filterIcons}`)}
						</Button>
					)}
				/>
			))}
			<p className="mt-2 text-lg font-semibold leading-none tracking-tight">
				{t("dietaryOptions")}
			</p>
			<div className="flex flex-wrap gap-2">
				<form.Field
					name="dietaryOptions"
					listeners={{
						onChange: () => {
							if (hide?.submit) {
								form.handleSubmit();
							}
						},
					}}
					children={(field) => (
						<div className="flex flex-wrap gap-2">
							{DietaryOptionSchema.options
								.filter((type) => type !== "other")
								.map((option) => (
									<Button
										key={option}
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
											field.handleChange(
												field.state.value?.includes(
													option,
												)
													? field.state.value?.filter(
															(id) =>
																id !== option,
														)
													: [
															...(field.state
																.value ?? []),
															option,
														],
											);
										}}
										active={
											field.state.value?.includes(
												option,
											) ?? false
										}
										className="flex-grow justify-start"
									>
										<Utensils size={18} />
										{t(`dietaryOptionTypes.${option}`)}
									</Button>
								))}
						</div>
					)}
				/>
			</div>
		</>
	);

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className="no-print relative flex w-full flex-col gap-2"
		>
			{!hide?.query && (
				<div className="relative flex-1">
					<form.Field
						name="query"
						children={(field) => (
							<Input
								type="text"
								id={field.name}
								name={field.name}
								placeholder={t("search")}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) =>
									field.handleChange(e.target.value)
								}
								className="h-12 pl-10 !text-base"
							/>
						)}
					/>
					<div className="absolute left-3 top-0 flex h-full items-center pr-2">
						<Search size={18} />
					</div>
					<button type="submit" className="hidden" />
					{hide?.filters && (
						<Button
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								setDialogOpen(true);
							}}
							className={"absolute right-3 top-1.5 rounded-full"}
							variant="ghost"
							size="icon"
						>
							<SlidersHorizontal size={18} />
							{numberOfFiltersOn > 0 && (
								<span className="absolute left-[22px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full border border-white bg-primary-red text-xs text-white">
									{numberOfFiltersOn}
								</span>
							)}
						</Button>
					)}
				</div>
			)}
			{hide?.filters ? (
				<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
					<DialogContent className="flex max-h-screen flex-col gap-2 overflow-y-auto sm:max-w-lg">
						<DialogHeader className="flex flex-col items-start text-left">
							<DialogTitle>{t("filters.title")}</DialogTitle>
							<DialogDescription>
								{t("filters.description")}
							</DialogDescription>
						</DialogHeader>
						<FilterButtons />
					</DialogContent>
				</Dialog>
			) : (
				<FilterButtons />
			)}
			{!hide?.submit && (
				<Button type="submit" className="mt-4" variant="secondary">
					{t("search")}
				</Button>
			)}
		</form>
	);
};

export default SearchForm;
