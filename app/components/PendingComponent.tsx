import { Loader2 } from "lucide-react";

export const PendingComponent = () => {
	return (
		<div className="my-20 flex items-center justify-center">
			<Loader2 className="animate-spin" />
		</div>
	);
};
