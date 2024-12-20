import { FieldState } from "@tanstack/react-form";

export const Error = ({ text }: { text: string }) => {
	return (
		<em role="alert" className="text-sm text-destructive">
			{text}
		</em>
	);
};

export function FieldError({ state }: { state: FieldState<any> }) {
	return state.meta.errors ? (
		<Error text={state.meta.errors.join(", ")} />
	) : null;
}
