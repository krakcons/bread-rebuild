import { getTranslations } from "@/lib/language";
import { cn } from "@/lib/utils";
import zxcvbn from "zxcvbn";

export const PasswordStrength = ({
	password,
	language,
}: {
	password: string;
	language: string;
}) => {
	const strength = zxcvbn(password);
	const t = getTranslations(language);

	const strengthColors = [
		"bg-red-400",
		"bg-red-400",
		"bg-yellow-400",
		"bg-green-400",
		"bg-green-400",
	];

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center gap-1">
				{Array.from({ length: strength.score }).map((_, index) => (
					<div
						key={index}
						className={cn(
							"h-2 flex-1 rounded-full",
							strengthColors[strength.score],
						)}
					/>
				))}
				{Array.from({ length: 4 - strength.score }).map((_, index) => (
					<div
						key={index}
						className="h-2 flex-1 rounded-full bg-muted"
					/>
				))}
			</div>
			<p className="self-end text-sm text-muted-foreground">
				{!password
					? t.admin.auth.signup.form.passwordStrength.title
					: t.admin.auth.signup.form.passwordStrength[strength.score]}
			</p>
		</div>
	);
};
