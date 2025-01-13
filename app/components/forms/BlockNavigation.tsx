import { Block, useRouteContext } from "@tanstack/react-router";

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
	const { t, locale } = useRouteContext({
		from: "__root__",
	});
	return (
		<Block shouldBlockFn={shouldBlockFn} withResolver>
			{({ status, proceed, reset }) => (
				<AlertDialog open={status === "blocked"}>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>
								{t.admin.confirm.title}
							</AlertDialogTitle>
							<AlertDialogDescription>
								{t.admin.confirm.description}
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel onClick={reset}>
								{t.admin.confirm.cancel}
							</AlertDialogCancel>
							<AlertDialogAction onClick={proceed}>
								{t.admin.confirm.confirm}
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			)}
		</Block>
	);
}
