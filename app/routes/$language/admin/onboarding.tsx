import { Button, buttonVariants } from "@/components/ui/Button";
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
import {
	onboardProviderFn,
	ProviderOnboardingSchema,
} from "@/server/actions/provider";
import { ProviderPhoneNumberType } from "@/server/types";
import { useForm, useStore } from "@tanstack/react-form";
import { createFileRoute, ErrorComponent, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/start";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";

export const Route = createFileRoute("/$language/admin/onboarding")({
	component: RouteComponent,
	errorComponent: ErrorComponent,
});

function RouteComponent() {
	const onboardProviderMutation = useServerFn(onboardProviderFn);
	const { language } = Route.useParams();
	const t = getTranslations(language);
	const form = useForm({
		defaultValues: {
			name: "",
			email: undefined,
			website: undefined,
			description: undefined,
			phoneNumbers: [],
		},
		validators: {
			onSubmit: ProviderOnboardingSchema,
		},
		onSubmit: async ({ value: data, formApi }) => {
			try {
				await onboardProviderMutation({ data });
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
		<div className="mx-auto flex h-screen w-screen max-w-[600px] flex-col justify-center gap-4 p-4">
			<Link
				to="/$language"
				params={{ language }}
				className={buttonVariants({
					variant: "link",
					class: "self-start",
					size: "auto",
				})}
			>
				<ArrowLeft size={20} />
				{t.common.back} {t.common.to} {t.common.bread}
			</Link>
			<h1>{t.admin.onboarding.title}</h1>
			<p className="text-sm text-muted-foreground">
				{t.admin.onboarding.description}
			</p>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
			>
				<div className="flex flex-col gap-4">
					{serverError && (
						<ErrorMessage text={serverError as string} />
					)}
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
														value={
															field.state.value
														}
														onBlur={
															field.handleBlur
														}
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
														value={
															field.state.value
														}
														onValueChange={(
															value,
														) =>
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
		</div>
	);
}
