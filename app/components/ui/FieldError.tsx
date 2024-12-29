import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { FieldState } from "@tanstack/react-form";

export function FieldError({ state }: { state: FieldState<any> }) {
	return state.meta.errors ? (
		<ErrorMessage text={state.meta.errors.join(", ")} />
	) : null;
}
