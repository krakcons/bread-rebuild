import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { login, LoginSchema } from "@/server/auth/actions";
import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/$language/admin/login")({
	component: RouteComponent,
});

function RouteComponent() {
	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		onSubmit: async ({ value: data }) => {
			await login({ data });
		},
		validators: {
			onChange: LoginSchema,
		},
	});

	return (
		<div className="mx-auto flex h-screen w-screen max-w-[400px] flex-col justify-center p-4">
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
			>
				<div className="flex flex-col gap-4">
					<form.Field
						name="email"
						children={(field) => (
							<Label>
								Email
								<Input
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) =>
										field.handleChange(e.target.value)
									}
								/>
							</Label>
						)}
					/>
					<form.Field
						name="password"
						children={(field) => (
							<Label>
								Password
								<Input
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) =>
										field.handleChange(e.target.value)
									}
								/>
							</Label>
						)}
					/>
				</div>
				<Button type="submit">Submit</Button>
			</form>
		</div>
	);
}
