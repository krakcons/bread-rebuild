import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$language/resource/$resourceId/")({
	component: () => <div>Hello /$language/resource/$resourceId/!</div>,
});

function ResourcePage() {
	const { language, resourceId } = Route.useParams();
	return (
		<div>
			{language}/{resourceId}
		</div>
	);
}
