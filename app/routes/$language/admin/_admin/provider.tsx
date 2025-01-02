import { ProviderForm } from "@/components/forms/Provider";
import { editProviderFn, getProviderFn } from "@/server/actions/provider";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/start";

const english = {
	title: "Provider",
	description: "Manage your provider information here.",
};

const french: typeof english = {
	title: "Fournisseur",
	description: "Gérez vos informations de fournisseur ici.",
};

export const Route = createFileRoute("/$language/admin/_admin/provider")({
	component: RouteComponent,
	loader: async ({ params }) => {
		const provider = await getProviderFn();
		return {
			pt: params.language === "fr" ? french : english,
			provider,
		};
	},
});

function RouteComponent() {
	const router = useRouter();
	const editProvider = useServerFn(editProviderFn);
	const { pt, provider } = Route.useLoaderData();
	const { language } = Route.useParams();
	console.log(provider);
	return (
		<div className="flex flex-col gap-4">
			<div className="mb-4 flex flex-col gap-2 border-b border-gray-200 pb-4">
				<h1>{pt.title}</h1>
				<p>{pt.description}</p>
			</div>
			<ProviderForm
				language={language}
				defaultValues={provider}
				onSubmit={async (data) => {
					await editProvider({ data });
					router.invalidate();
				}}
			/>
		</div>
	);
}
