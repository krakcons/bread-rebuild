import { Button } from "@/components/ui/Button";
import { SignupSchema } from "@/server/auth/actions";
import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/$language/admin/signup")({
	component: RouteComponent,
});

function RouteComponent() {
	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
			passwordConfirmation: "",
		},
		onSubmit: async ({ value }) => {
			// Do something with form data
			console.log(value);
		},
		validators: {
			onChange: SignupSchema,
		},
	});

	return (
		<div>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
			>
				<div>
					<form.Field
						name="email"
						children={(field) => (
							<input
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) =>
									field.handleChange(e.target.value)
								}
							/>
						)}
					/>
					<form.Field
						name="password"
						children={(field) => (
							<input
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) =>
									field.handleChange(e.target.value)
								}
							/>
						)}
					/>
					<form.Field
						name="passwordConfirmation"
						children={(field) => (
							<input
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) =>
									field.handleChange(e.target.value)
								}
							/>
						)}
					/>
				</div>
				<Button type="submit">Submit</Button>
			</form>
		</div>
	);
}
