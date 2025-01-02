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
import { getTranslations } from "@/lib/language";
import { ProviderFormSchema } from "@/server/actions/provider";
import { FullProviderType, ProviderPhoneNumberType } from "@/server/types";
import { useForm, useStore } from "@tanstack/react-form";
import { Loader2, Trash2 } from "lucide-react";
import { z } from "zod";

export const ProviderForm = ({
	language,
	defaultValues,
	onSubmit,
}: {
	language: string;
	defaultValues?: FullProviderType;
	onSubmit: (data: z.infer<typeof ProviderFormSchema>) => void;
}) => {
	const t = getTranslations(language);
	const form = useForm({
		defaultValues: {
			name: defaultValues?.name ?? "",
			email: defaultValues?.email ?? undefined,
			website: defaultValues?.website ?? undefined,
			description: defaultValues?.description ?? undefined,
			phoneNumbers: defaultValues?.phoneNumbers ?? [],
		},
		validators: {
			onSubmit: ProviderFormSchema,
		},
		onSubmit: async ({ value: data, formApi }) => {
			try {
				await onSubmit(data);
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

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
		>
			<div className="flex flex-col gap-4">
				{serverError && <ErrorMessage text={serverError as string} />}
				<form.Field
					name="name"
					children={(field) => (
						<Label>
							{t.admin.onboarding.form.name}
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
					name="description"
					children={(field) => (
						<Label>
							<span className="flex items-center gap-1">
								{t.admin.onboarding.form.description}
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
						{t.admin.onboarding.contact.title}
					</p>
					<p className="text-sm text-muted-foreground">
						{t.admin.onboarding.contact.description}
					</p>
				</div>
				<form.Field
					name="email"
					children={(field) => (
						<Label>
							<span className="flex items-center gap-1">
								{t.admin.onboarding.form.email}
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
								{t.admin.onboarding.form.website}
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
								{t.admin.onboarding.form.phoneNumbers}
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
								{t.admin.onboarding.form.addPhoneNumber}
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
