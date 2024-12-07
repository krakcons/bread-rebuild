import { NotFound } from "@/components/NotFound";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/Popover";
import { getTranslations, setLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Bookmark, Menu, Printer } from "lucide-react";

export const Route = createFileRoute("/$language")({
	component: LayoutComponent,
	notFoundComponent: NotFound,
	beforeLoad: ({ params }) => {
		setLanguage({ data: params.language });
	},
});

function LayoutComponent() {
	const { language } = Route.useParams();
	const navigate = Route.useNavigate();
	const translations = getTranslations(language);
	return (
		<div>
			<div className="flex items-center justify-center border-b border-gray-300">
				<header className="flex w-full max-w-screen-md items-center justify-between gap-4 px-4 py-3">
					<Link
						to="/$language"
						params={{ language }}
						className="flex items-center gap-2"
					>
						<img
							src="/logo.png"
							alt="Bread Logo"
							className="w-12"
						/>
						<p className="hidden font-semibold tracking-widest text-primary sm:block sm:text-xl">
							BREAD
						</p>
					</Link>
					<div className="no-print flex items-center gap-2">
						<Link
							to="/$language/saved"
							params={{ language }}
							className="flex items-center gap-2 rounded-full border border-gray-300 px-2.5 py-1.5 transition-colors hover:bg-gray-50/50"
						>
							<Bookmark size={18} />
							{translations.saved.title}
						</Link>
						<button
							onClick={() => {
								window.print();
							}}
							className="hidden items-center gap-2 rounded-full border border-gray-300 px-2.5 py-1.5 transition-colors hover:bg-gray-50/50 sm:flex"
						>
							<Printer size={18} />
							{translations.print}
						</button>
						<button
							onClick={() => {
								navigate({
									replace: true,
									params: {
										language:
											language === "en" ? "fr" : "en",
									},
									search: (prev) => ({ ...prev }),
								});
							}}
							className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 transition-colors hover:bg-gray-50/50"
						>
							{language === "en" ? "FR" : "EN"}
						</button>
						<Popover>
							<PopoverTrigger className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 transition-colors hover:bg-gray-50/50">
								<Menu size={18} />
							</PopoverTrigger>
							<PopoverContent
								align="end"
								className={cn(
									"flex flex-col gap-2",
									language === "fr" ? "w-64" : "w-48",
								)}
							>
								<button
									onClick={() => {
										window.print();
									}}
									className="flex items-center justify-center gap-2 rounded-full border border-gray-300 px-2.5 py-1.5 transition-colors hover:bg-gray-50/50 sm:hidden"
								>
									<Printer size={18} />
									{translations.print}
								</button>
								<Link
									to="/$language/terms"
									params={{ language }}
									className="text-center"
								>
									{translations.terms}
								</Link>
								<Link
									to="/$language/privacy-policy"
									params={{ language }}
									className="text-center"
								>
									{translations.privacy}
								</Link>
							</PopoverContent>
						</Popover>
					</div>
				</header>
			</div>
			<div className="mx-auto max-w-screen-md p-4">
				<Outlet />
			</div>
		</div>
	);
}
