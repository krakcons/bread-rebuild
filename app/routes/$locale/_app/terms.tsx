import { getTranslations, useTranslations } from "@/lib/locale";
import { createFileRoute, ErrorComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/$locale/_app/terms")({
	component: RouteComponent,
	errorComponent: ErrorComponent,
	head: ({ params: { locale } }) => {
		const translations = getTranslations(locale);
		return {
			meta: [
				{
					title: translations.terms,
				},
			],
		};
	},
});

function RouteComponent() {
	const { locale } = Route.useParams();
	const translations = useTranslations(locale);
	return (
		<div className="flex flex-col gap-4">
			<h1 className="text-3xl font-semibold">{translations.terms}</h1>
			<p>
				Lorem ipsum dolor sit amet consectetur adipisicing elit.
				Excepturi perferendis, modi consequuntur aspernatur rerum autem
				tempore. Totam optio harum hic, aut natus beatae quae fugiat
				iste eum, dignissimos libero voluptate.
			</p>
			<p>
				Lorem ipsum dolor sit amet consectetur adipisicing elit.
				Excepturi perferendis, modi consequuntur aspernatur rerum autem
				tempore.
			</p>
			<h3 className="text-xl font-semibold">Lorem adipisicing elit</h3>
			<p>
				Amet consectetur adipisicing elit. Excepturi perferendis, modi
				consequuntur aspernatur rerum autem tempore. Lorem ipsum dolor,
				sit amet consectetur adipisicing elit. Quasi nulla corporis
				officiis distinctio vitae? Temporibus velit delectus obcaecati
				officiis mollitia, tempora sit, amet, dolor quae tenetur
				similique repellat quasi iure.
			</p>
			<p>
				Lorem ipsum dolor sit amet consectetur adipisicing elit.
				Excepturi perferendis, modi consequuntur aspernatur rerum autem
				tempore. Totam optio harum hic, aut natus beatae quae fugiat
				iste eum, dignissimos libero voluptate.
			</p>
			<h3 className="text-xl font-semibold">
				Lorem ipsum dolor sit amet
			</h3>
			<p>
				Lorem ipsum dolor sit amet consectetur adipisicing elit.
				Excepturi perferendis, modi consequuntur aspernatur rerum autem
				tempore.
			</p>
			<p>
				Amet consectetur adipisicing elit. Excepturi perferendis, modi
				consequuntur aspernatur rerum autem tempore. Lorem ipsum dolor,
				sit amet consectetur adipisicing elit. Quasi nulla corporis
				officiis distinctio vitae? Temporibus velit delectus obcaecati
				officiis mollitia, tempora sit, amet, dolor quae tenetur
				similique repellat quasi iure.
			</p>
		</div>
	);
}