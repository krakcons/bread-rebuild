import { NotFound } from "@/components/NotFound";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/Popover";
import { getTranslations, setLanguage } from "@/lib/language";
import useSaved from "@/lib/saved";
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
	const saved = useSaved();

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
						<p className="print font-semibold tracking-widest text-primary sm:text-xl">
							BREAD
						</p>
					</Link>
					<div className="no-print flex items-center gap-2">
						<Link
							to="/$language/saved"
							params={{ language }}
							className="relative flex h-10 w-10 items-center justify-center gap-2 rounded-full border border-gray-300 p-0 transition-colors hover:bg-gray-50/50 sm:w-auto sm:px-2.5"
						>
							<Bookmark size={20} />
							<p className="hidden sm:block">
								{translations.saved.title}
							</p>
							{saved.saved.filter((s) => !s.seen).length > 0 && (
								<span className="absolute left-5 top-1 flex h-4 w-4 items-center justify-center rounded-full border border-white bg-secondary text-xs text-white">
									{saved.saved.filter((s) => !s.seen).length}
								</span>
							)}
						</Link>
						<button
							onClick={() => {
								window.print();
							}}
							className="flex h-10 w-10 items-center justify-center gap-2 rounded-full border border-gray-300 p-0 transition-colors hover:bg-gray-50/50 sm:w-auto sm:px-2.5"
						>
							<Printer size={20} />
							<p className="hidden sm:block">
								{translations.print}
							</p>
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
