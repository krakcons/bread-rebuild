import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/Accordion";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$locale/_app/faq")({
	component: RouteComponent,
});

function RouteComponent() {
	const { t } = Route.useRouteContext();
	return (
		<div className="my-[5vh] flex flex-col gap-4">
			<h1>{t.faq.title}</h1>
			<p className="text-muted-foreground">{t.faq.description}</p>
			<hr className="my-4" />
			<div className="flex flex-col gap-4 border p-4">
				<h3>{t.faq.general.title}</h3>
				<Accordion type="multiple">
					{t.faq.general.list.map((faq) => (
						<AccordionItem value={faq.question}>
							<AccordionTrigger className="text-base">
								{faq.question}
							</AccordionTrigger>
							<AccordionContent className="text-base">
								{faq.answer}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</div>
			<div className="flex flex-col gap-4 border p-4">
				<h3>{t.faq.seekers.title}</h3>
				<Accordion type="multiple">
					{t.faq.seekers.list.map((faq) => (
						<AccordionItem value={faq.question}>
							<AccordionTrigger className="text-base">
								{faq.question}
							</AccordionTrigger>
							<AccordionContent className="text-base">
								{faq.answer}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</div>
	);
}
