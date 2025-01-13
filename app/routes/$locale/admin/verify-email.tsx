import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { FieldError } from "@/components/ui/FieldError";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/InputOTP";
import { Label } from "@/components/ui/Label";
import {
	resendEmailVerification,
	resendPasswordResetVerification,
	verifyEmail,
	VerifyEmailSchema,
	verifyPasswordResetEmail,
} from "@/server/auth/actions";
import { useForm, useStore } from "@tanstack/react-form";
import {
	createFileRoute,
	ErrorComponent,
	useRouteContext,
	useRouter,
} from "@tanstack/react-router";
import { useServerFn } from "@tanstack/start";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";

export const Route = createFileRoute("/$locale/admin/verify-email")({
	component: RouteComponent,
	errorComponent: ErrorComponent,
	validateSearch: z.object({
		type: z.enum(["email_verification", "password_reset"]).optional(),
	}),
});

function RouteComponent() {
	const router = useRouter();
	const { type = "email_verification" } = Route.useSearch();
	const navigate = Route.useNavigate();
	const verifyEmailMutation = useServerFn(verifyEmail);
	const verifyPasswordResetEmailMutation = useServerFn(
		verifyPasswordResetEmail,
	);
	const resendEmailVerificationMutation = useServerFn(
		resendEmailVerification,
	);
	const resendPasswordResetVerificationMutation = useServerFn(
		resendPasswordResetVerification,
	);
	const [resendCodeSent, setResendCodeSent] = useState(false);
	const { t, locale } = useRouteContext({
		from: "__root__",
	});
	const form = useForm({
		defaultValues: {
			code: "",
		},
		validators: {
			onSubmit: VerifyEmailSchema,
		},
		onSubmit: async ({ value: data, formApi }) => {
			try {
				let result;
				if (type === "email_verification") {
					result = await verifyEmailMutation({ data });
				} else if (type === "password_reset") {
					result = await verifyPasswordResetEmailMutation({ data });
				}
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

	useEffect(() => {
		if (resendCodeSent) {
			setTimeout(() => {
				setResendCodeSent(false);
			}, 1000);
		}
	}, [resendCodeSent]);

	return (
		<div className="mx-auto flex h-screen w-screen max-w-[400px] flex-col justify-center gap-4 p-4">
			<Button
				onClick={() => {
					navigate({
						replace: true,
						params: {
							locale: locale === "en" ? "fr" : "en",
						},
						search: (prev) => ({ ...prev }),
					});
				}}
				size="icon"
			>
				{locale === "en" ? "FR" : "EN"}
			</Button>
			<Button
				variant="link"
				size="auto"
				className="self-start"
				onClick={() => router.history.back()}
			>
				<ArrowLeft size={16} />
				{t.common.back}
			</Button>
			<h1>{t.admin.auth.verifyEmail.title}</h1>
			<p className="text-sm text-muted-foreground">
				{t.admin.auth.verifyEmail.description[type]}
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
						name="code"
						children={(field) => (
							<Label>
								{t.form.resetPassword.code}
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
			<div className="flex items-start justify-start gap-1">
				<p className="text-sm text-muted-foreground">
					{t.admin.auth.verifyEmail.resend.preface}
				</p>
				<Button
					disabled={resendCodeSent}
					variant="link"
					size="auto"
					onClick={async () => {
						if (type === "email_verification") {
							await resendEmailVerificationMutation();
						} else if (type === "password_reset") {
							await resendPasswordResetVerificationMutation();
						}
						setResendCodeSent(true);
					}}
					className={"gap-1"}
				>
					{resendCodeSent && (
						<Loader2 size={16} className="animate-spin" />
					)}
					{t.admin.auth.verifyEmail.resend.link}
				</Button>
			</div>
		</div>
	);
}
