import { FieldState } from "@tanstack/react-form";

export function FieldError({ state }: { state: FieldState<any> }) {
	return state.meta.errors ? (
		<em role="alert" className="text-destructive">
			{state.meta.errors.join(", ")}
		</em>
	) : null;
}
