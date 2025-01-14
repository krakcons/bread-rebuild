import { Block, useParams } from "@tanstack/react-router";

import { useTranslations } from "use-intl";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "../ui/AlertDialog";

export function BlockNavigation({
	shouldBlockFn,
}: {
	shouldBlockFn: () => boolean;
}) {
	const t = useTranslations();
	const { locale } = useParams({
		from: "/$locale",
	});
	return (
		<Block shouldBlockFn={shouldBlockFn} withResolver>
			{({ status, proceed, reset }) => (
				<AlertDialog open={status === "blocked"}>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>
								{t("admin.confirm.title")}
							</AlertDialogTitle>
							<AlertDialogDescription>
								{t("admin.confirm.description")}
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel onClick={reset}>
								{t("admin.confirm.cancel")}
							</AlertDialogCancel>
							<AlertDialogAction onClick={proceed}>
								{t("admin.confirm.confirm")}
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			)}
		</Block>
	);
}
