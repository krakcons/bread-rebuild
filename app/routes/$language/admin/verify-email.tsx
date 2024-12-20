import { Button, buttonVariants } from "@/components/ui/Button";
import { Error, FieldError } from "@/components/ui/Error";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/InputOTP";
import { Label } from "@/components/ui/Label";
import { getTranslations } from "@/lib/language";
import {
	resendEmailVerification,
	verifyEmail,
	VerifyEmailSchema,
} from "@/server/auth/actions";
import { useForm, useStore } from "@tanstack/react-form";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/start";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { ArrowLeft, Loader2 } from "lucide-react";

export const Route = createFileRoute("/$language/admin/verify-email")({
	component: RouteComponent,
});

function RouteComponent() {
	const verifyEmailMutation = useServerFn(verifyEmail);
	const resendEmailVerificationMutation = useServerFn(
		resendEmailVerification,
	);
	const { language } = Route.useParams();
	const t = getTranslations(language);
	const form = useForm({
		defaultValues: {
			code: "",
		},
		validators: {
			onSubmit: VerifyEmailSchema,
		},
		onSubmit: async ({ value: data, formApi }) => {
			try {
				const result = await verifyEmailMutation({ data });
				if (result.error) {
					formApi.setErrorMap({
						onServer: result.error,
					});
				}
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
		<div className="mx-auto flex h-screen w-screen max-w-[400px] flex-col justify-center gap-4 p-4">
			<Link
				to="/$language/admin/login"
				params={{ language }}
				className={buttonVariants({
					variant: "link",
					class: "self-start",
					size: "auto",
				})}
			>
				<ArrowLeft size={20} />
				{t.common.back}
			</Link>
			<h1>{t.admin.auth.verifyEmail.title}</h1>
			<div className="flex items-start justify-start gap-1">
				<p className="text-sm text-muted-foreground">
					{t.admin.auth.verifyEmail.resend.preface}
				</p>
				<Button
					variant="link"
					size="auto"
					onClick={() => {
						resendEmailVerificationMutation();
					}}
				>
					{t.admin.auth.verifyEmail.resend.link}
				</Button>
			</div>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
			>
				<div className="flex flex-col gap-4">
					{serverError && <Error text={serverError as string} />}
					<form.Field
						name="code"
						children={(field) => (
							<Label>
								{t.admin.auth.verifyEmail.form.code}
								<InputOTP
									maxLength={6}
									pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(value) =>
										field.handleChange(value)
									}
								>
									<InputOTPGroup>
										<InputOTPSlot index={0} />
										<InputOTPSlot index={1} />
										<InputOTPSlot index={2} />
										<InputOTPSlot index={3} />
										<InputOTPSlot index={4} />
										<InputOTPSlot index={5} />
									</InputOTPGroup>
								</InputOTP>
								<p className="text-sm text-muted-foreground">
									{t.admin.auth.verifyEmail.description}
								</p>
								<FieldError state={field.state} />
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
