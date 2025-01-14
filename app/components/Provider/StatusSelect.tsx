import { useTranslations } from "use-intl";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/Select";

export const StatusSelect = ({
	onChange,
	defaultValue,
}: {
	onChange: (status: "pending" | "approved" | "rejected") => void;
	defaultValue?: "pending" | "approved" | "rejected";
}) => {
	const t = useTranslations();

	return (
		<Select
			defaultValue={defaultValue}
			onValueChange={(value) => {
				if (onChange) {
					onChange(value as "pending" | "approved" | "rejected");
				}
			}}
		>
			<SelectTrigger className="min-w-28">
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="pending">
					{t("admin.providers.status.pending")}
				</SelectItem>
				<SelectItem value="approved">
					{t("admin.providers.status.approved")}
				</SelectItem>
				<SelectItem value="rejected">
					{t("admin.providers.status.rejected")}
				</SelectItem>
			</SelectContent>
		</Select>
	);
};
