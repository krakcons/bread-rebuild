import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { FieldState, ValidationError } from "@tanstack/react-form";

export function FieldError({
	state,
	errors,
}: {
	state?: FieldState<any>;
	errors?: ValidationError[];
}) {
	const errorList = state?.meta.errors ?? errors ?? [];
	return errorList?.length > 0 ? (
		<ErrorMessage text={errorList.join(", ")} />
	) : null;
}
