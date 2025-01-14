import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/Accordion";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslations } from "use-intl";

export const Route = createFileRoute("/$locale/_app/faq")({
	component: RouteComponent,
});

function RouteComponent() {
	const t = useTranslations();

	const generalKeys = ["0", "1", "2", "3"] as const;
	const seekerKeys = [
		"0",
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
	] as const;

	return (
		<div className="my-[5vh] flex flex-col gap-4">
			<h1>{t("faq.title")}</h1>
			<p className="text-muted-foreground">{t("faq.description")}</p>
			<hr className="my-4" />
			<div className="flex flex-col gap-4 border p-4">
				<h3>{t("faq.general.title")}</h3>
				<Accordion type="multiple">
					{generalKeys.map((key) => (
						<AccordionItem value={key} key={key}>
							<AccordionTrigger className="text-base">
								{t(`faq.general.list.${key}.question`)}
							</AccordionTrigger>
							<AccordionContent className="text-base">
								{t(`faq.general.list.${key}.answer`)}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</div>
			<div className="flex flex-col gap-4 border p-4">
				<h3>{t("faq.seekers.title")}</h3>
				<Accordion type="multiple">
					{seekerKeys.map((key) => (
						<AccordionItem value={key} key={key}>
							<AccordionTrigger className="text-base">
								{t(`faq.seekers.list.${key}.question`)}
							</AccordionTrigger>
							<AccordionContent className="text-base">
								{t(`faq.seekers.list.${key}.answer`)}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</div>
	);
}
