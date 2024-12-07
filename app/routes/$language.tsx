import { getTranslations, setLanguage } from "@/lib/language";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Printer } from "lucide-react";

export const Route = createFileRoute("/$language")({
	component: LayoutComponent,
	beforeLoad: ({ params }) => {
		setLanguage(params.language as "en" | "fr");
	},
});

function LayoutComponent() {
	const { language } = Route.useParams();
	const navigate = Route.useNavigate();
	const translations = getTranslations(language);
	return (
		<div>
			<div className="flex justify-center items-center border-b border-gray-300">
				<header className="max-w-screen-md w-full flex items-center gap-4 justify-between py-3 px-4">
					<Link to="/$language" params={{ language }} className="flex items-center gap-2">
						<img src="/logo.png" alt="Bread Logo" className="w-12" />
						<p className="text-primary font-semibold hidden tracking-widest sm:block sm:text-xl">
							BREAD
						</p>
					</Link>
					<div className="flex items-center gap-2 no-print">
						<Link to="/$language/saved" params={{ language }} className="pr-2">
							{translations.saved.title}
						</Link>
						<button
							onClick={() => {
								window.print();
							}}
							className="flex items-center gap-2 border border-gray-300 rounded-full px-2.5 py-1.5 hover:bg-gray-50/50 transition-colors"
						>
							<Printer size={18} />
							{translations.print}
						</button>
						<button
							onClick={() => {
								navigate({
									replace: true,
									params: { language: language === "en" ? "fr" : "en" },
									search: (prev) => ({ ...prev }),
								});
							}}
							className="h-10 w-10 rounded-full flex items-center justify-center border border-gray-300 hover:bg-gray-50/50 transition-colors"
						>
							{language === "en" ? "FR" : "EN"}
						</button>
					</div>
				</header>
			</div>
			<div className="p-4 max-w-screen-md mx-auto">
				<Outlet />
			</div>
		</div>
	);
}
