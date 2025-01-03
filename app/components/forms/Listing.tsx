import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { FieldError } from "@/components/ui/FieldError";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/Select";
import { Textarea } from "@/components/ui/TextArea";
import { getTranslations } from "@/lib/locale";
import { ListingFormSchema } from "@/server/actions/listings";
import { ProviderPhoneNumberType, ResourceType } from "@/server/db/types";
import { useForm, useStore } from "@tanstack/react-form";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Loader2, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { z } from "zod";
import { Checkbox } from "../ui/checkbox";

const checkboxOptions = [
	"free",
	"preperation",
	"transit",
	"wheelchair",
	"parking",
];

export const ListingForm = ({
	locale,
	defaultValues,
	onSubmit,
}: {
	locale: string;
	defaultValues?: ResourceType;
	onSubmit: (data: z.infer<typeof ListingFormSchema>) => void;
}) => {
	const navigate = useNavigate({
		from: "/$locale/admin/provider",
	});
	const { editing } = useSearch({
		from: "/$locale/admin/_admin",
	});
	const t = getTranslations(locale);
	const form = useForm({
		defaultValues: {
			description: defaultValues?.description ?? "",
			email: defaultValues?.email ?? "",
			website: defaultValues?.website ?? "",
			phoneNumbers: defaultValues?.phoneNumbers ?? [],
			// TODO: Add default values for other fields
		},
		validators: {
			onSubmit: ListingFormSchema,
		},
		onSubmit: async ({ value: data, formApi }) => {
			try {
				await onSubmit(data);
				await navigate({
					search: (search) => ({
						...search,
						editing: false,
					}),
				});
			} catch (error) {
				formApi.setErrorMap({
					onServer: "Something went wrong",
				});
			}
		},
	});

	const serverError = useStore(
		form.store,
		(formState) => formState.errorMap.onServer,
	);

	const isDirty = useStore(form.store, (formState) => formState.isDirty);

	useEffect(() => {
		navigate({
			search: (prev) => ({
				...prev,
				editing: isDirty,
			}),
		});
	}, [isDirty]);

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			onChange={(e) => {
				e.preventDefault();
				e.stopPropagation();
				if (!editing) {
					navigate({
						search: (search) => ({
							...search,
							editing: true,
						}),
					});
				}
			}}
		>
			<div className="flex flex-col gap-4">
				{serverError && <ErrorMessage text={serverError as string} />}
				<form.Field
					name="description"
					children={(field) => (
						<Label>
							<span className="flex items-center gap-1">
								{t.admin.listings.new.form.description}
								<span className="text-xs text-muted-foreground">
									({t.common.optional})
								</span>
							</span>
							<Textarea
								name={field.name}
								value={field.state.value ?? ""}
								onBlur={field.handleBlur}
								onChange={(e) =>
									field.handleChange(e.target.value)
								}
							/>
						</Label>
					)}
				/>
				<div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
					<p className="font-medium">
						{t.admin.listings.new.form.toggles.title}
					</p>
					<p className="text-sm text-muted-foreground">
						{t.admin.listings.new.form.toggles.description}
					</p>
				</div>
				{checkboxOptions.map((option) => (
					<>
						<form.Field
							name={option}
							children={(field) => (
								<Label className="flex flex-row items-center gap-2">
									<Checkbox
										name={field.name}
										checked={field.state.value ?? false}
										onBlur={field.handleBlur}
										onCheckedChange={(checked: boolean) =>
											field.handleChange(checked)
										}
									/>
									{t.admin.listings.new.form[option]}
								</Label>
							)}
						/>
						<form.Field
							name={`${option}Notes`}
							children={(field) => (
								<Label>
									<span className="flex items-center gap-1">
										{t.admin.listings.new.form.notes}
										<span className="text-xs text-muted-foreground">
											({t.common.optional})
										</span>
									</span>
									<Textarea
										name={field.name}
										value={field.state.value ?? ""}
										onBlur={field.handleBlur}
										onChange={(e) =>
											field.handleChange(e.target.value)
										}
									/>
								</Label>
							)}
						/>
					</>
				))}
				<div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
					<p className="font-medium">
						{t.admin.listings.new.form.contact.title}
					</p>
					<p className="text-sm text-muted-foreground">
						{t.admin.listings.new.form.contact.description}
					</p>
				</div>
				<form.Field
					name="email"
					children={(field) => (
						<Label>
							<span className="flex items-center gap-1">
								{t.admin.listings.new.form.contact.email}
								<span className="text-xs text-muted-foreground">
									({t.common.optional})
								</span>
							</span>
							<Input
								name={field.name}
								value={field.state.value ?? ""}
								onBlur={field.handleBlur}
								onChange={(e) =>
									field.handleChange(e.target.value)
								}
							/>
							<FieldError state={field.state} />
						</Label>
					)}
				/>
				<form.Field
					name="website"
					children={(field) => (
						<Label>
							<span className="flex items-center gap-1">
								{t.admin.listings.new.form.contact.website}
								<span className="text-xs text-muted-foreground">
									({t.common.optional})
								</span>
							</span>
							<Input
								name={field.name}
								value={field.state.value ?? ""}
								onBlur={field.handleBlur}
								onChange={(e) =>
									field.handleChange(e.target.value)
								}
							/>
							<FieldError state={field.state} />
						</Label>
					)}
				/>
				<form.Field
					name="phoneNumbers"
					mode="array"
					children={(field) => (
						<Label>
							<span className="flex items-center gap-1">
								{t.admin.listings.new.form.contact.phoneNumbers}
								<span className="text-xs text-muted-foreground">
									({t.common.optional})
								</span>
							</span>
							{field.state.value?.map((_, i) => (
								<div
									key={`phoneNumbers[${i}]`}
									className="flex gap-2"
								>
									<form.Field
										name={`phoneNumbers[${i}].phone`}
										children={(field) => (
											<div className="flex flex-grow flex-col gap-2">
												<Input
													name={`phoneNumbers[${i}].phone`}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) =>
														field.handleChange(
															e.target.value,
														)
													}
													autoComplete="tel"
												/>
												<FieldError
													state={field.state}
												/>
											</div>
										)}
									/>
									<form.Field
										name={`phoneNumbers[${i}].type`}
										children={(field) => (
											<div className="flex flex-col gap-2">
												<Select
													value={field.state.value}
													onValueChange={(value) =>
														field.handleChange(
															value as ProviderPhoneNumberType["type"],
														)
													}
												>
													<SelectTrigger className="w-[180px]">
														<SelectValue placeholder="" />
													</SelectTrigger>
													<SelectContent>
														{Object.keys(
															t.phoneTypes,
														).map((type) => (
															<SelectItem
																value={type}
																key={type}
															>
																{
																	t
																		.phoneTypes[
																		type
																	]
																}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FieldError
													state={field.state}
												/>
											</div>
										)}
									/>
									<Button
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
											field.removeValue(i);
										}}
										size="icon"
										className="mb-2"
									>
										<Trash2 size={16} />
									</Button>
								</div>
							))}
							<Button
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									field.pushValue({
										phone: "",
										type: "phone",
									});
								}}
							>
								{
									t.admin.listings.new.form.contact
										.addPhoneNumber
								}
							</Button>
						</Label>
					)}
				/>
				<form.Subscribe
					selector={(formState) => [formState.isSubmitting]}
				>
					{([isSubmitting]) => (
						<div className="flex items-start justify-between gap-2">
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting && (
									<Loader2 className="animate-spin" />
								)}
								{t.common.submit}
							</Button>
						</div>
					)}
				</form.Subscribe>
			</div>
		</form>
	);
};
