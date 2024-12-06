import { setLanguage } from "@/lib/language";
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
	return (
		<div>
			<div className="flex justify-center items-center border-b border-gray-300">
				<header className="max-w-screen-md w-full flex items-center gap-4 justify-between py-3">
					<Link to="/$language" className="flex items-center gap-2">
						<img src="/logo.png" alt="Bread Logo" className="w-12" />
						<p className="text-primary font-semibold text-xl tracking-widest">BREAD</p>
					</Link>
					<div className="flex items-center gap-4 no-print">
						<Link to="/$language/saved">Saved</Link>
						<button
							onClick={() => {
								window.print();
							}}
							className="px-4 py-2 rounded-full border border-gray-300 flex items-center gap-2"
						>
							<Printer size={18} />
							Print
						</button>
						<button
							onClick={() => {
								navigate({
									params: { language: language === "en" ? "fr" : "en" },
									search: (prev) => ({ ...prev }),
								});
							}}
							className="h-10 w-10 rounded-full flex items-center justify-center border border-primary bg-primary/10"
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
