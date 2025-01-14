import SearchForm from "@/components/forms/Search";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/$locale/_app/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { t } = Route.useRouteContext();
	const navigate = Route.useNavigate();

	return (
		<div className="my-[5vh] flex flex-col items-center justify-center gap-4 sm:my-[10vh]">
			<div className="flex items-center gap-2">
				<img src="/logo.png" alt="BREAD" className="h-20 w-20" />
				<h1 className="text-6xl font-medium tracking-wide text-primary">
					BREAD
				</h1>
			</div>
			<div className="max-w-lg">
				<SearchForm
					hide={{ filters: false, submit: false, query: true }}
					onSubmit={(values) => {
						navigate({
							to: "/$locale/search",
							search: (prev) => ({ ...prev, ...values }),
						});
					}}
				/>
			</div>
			<div className="flex flex-col items-center gap-2 sm:flex-row">
				<div className="flex items-center gap-2">
					<p className="text-sm">{t.poweredBy}</p>
					<a
						href="https://technologyhelps.org"
						target="_blank"
						className="flex items-center gap-2"
					>
						<img
							src="/tech-helps-logo.png"
							alt="Technology Helps Logo"
							className="h-16 w-16"
						/>
					</a>
				</div>
				<div className="h-[1px] w-4 bg-border sm:h-4 sm:w-px" />
				<div className="flex items-center text-sm">
					<Link
						from={Route.fullPath}
						to="/$locale/privacy-policy"
						className={cn(
							buttonVariants({
								variant: "link",
							}),
							"px-1",
						)}
					>
						{t.privacy}
					</Link>
					<Link
						from={Route.fullPath}
						to="/$locale/terms"
						className={cn(
							buttonVariants({
								variant: "link",
							}),
							"px-1",
						)}
					>
						{t.terms}
					</Link>
				</div>
			</div>
		</div>
	);
}
