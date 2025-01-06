import { Button, buttonVariants } from "@/components/ui/Button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/Select";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/SideBar";
import { Toaster } from "@/components/ui/Sonner";
import { Locale, locales, LocaleSchema, useTranslations } from "@/lib/locale";
import { logoutFn } from "@/server/auth/actions";
import {
	createFileRoute,
	ErrorComponent,
	Link,
	Outlet,
	redirect,
} from "@tanstack/react-router";
import { useServerFn } from "@tanstack/start";
import {
	BarChart,
	Building,
	ExternalLink,
	LayoutDashboard,
	UserMinus,
	Utensils,
} from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/$locale/admin/_admin")({
	component: RouteComponent,
	errorComponent: ErrorComponent,
	validateSearch: z.object({
		editingLocale: LocaleSchema.optional(),
	}),
	beforeLoad: async ({ search, params, location }) => {
		if (!search.editingLocale) {
			throw redirect({
				to: location.pathname,
				search: (search) => ({
					...search,
					editingLocale: params.locale as Locale,
				}),
				params,
			});
		}
	},
});

function RouteComponent() {
	const logout = useServerFn(logoutFn);
	const { locale } = Route.useParams();
	const search = Route.useSearch();
	const navigate = Route.useNavigate();
	const t = useTranslations(locale);

	return (
		<SidebarProvider>
			<Sidebar>
				<SidebarHeader>
					<Link
						to="/$locale"
						params={{
							locale,
						}}
						className={buttonVariants()}
					>
						<ExternalLink />
						{t.admin.nav.exit}
					</Link>
				</SidebarHeader>
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupContent>
							<SidebarGroupLabel>
								{t.admin.nav.admin}
							</SidebarGroupLabel>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<Link
										to="/$locale/admin"
										params={{
											locale,
										}}
										search={search}
									>
										<LayoutDashboard />
										{t.admin.nav.dashboard}
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<Link
										to="/$locale/admin/listings"
										params={{
											locale,
										}}
										search={search}
										replace
									>
										<Utensils />
										{t.admin.nav.listings}
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<Link
										to="/$locale/admin/provider"
										params={{
											locale,
										}}
										search={search}
									>
										<Building />
										{t.admin.nav.provider}
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<Link
										to="/$locale/admin/analytics"
										params={{
											locale,
										}}
										search={search}
									>
										<BarChart />
										{t.admin.nav.analytics}
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarGroupContent>
					</SidebarGroup>
					<SidebarGroup>
						<SidebarGroupContent>
							<SidebarGroupLabel>
								{t.admin.nav.account}
							</SidebarGroupLabel>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<button
										onClick={() => {
											logout();
										}}
									>
										<UserMinus />
										{t.admin.nav.logout}
									</button>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
				<SidebarFooter />
			</Sidebar>
			<main className="flex-1 p-4">
				<div className="flex flex-row items-center justify-between">
					<SidebarTrigger />
					<div className="flex flex-row items-center gap-2">
						<Select
							value={search.editingLocale}
							onValueChange={(value) => {
								navigate({
									replace: true,
									search: (search) => ({
										...search,
										editingLocale: value as Locale,
									}),
								});
							}}
						>
							<SelectTrigger className="gap-1">
								<p className="text-sm text-muted-foreground">
									{t.admin.editing}
								</p>
								<SelectValue placeholder="Select locale" />
							</SelectTrigger>
							<SelectContent>
								{locales.map(({ label, value }) => (
									<SelectItem key={value} value={value}>
										{label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Button
							onClick={() => {
								navigate({
									replace: true,
									params: (prev) => ({
										...prev,
										locale: locale === "en" ? "fr" : "en",
									}),
									search: (prev) => ({ ...prev }),
								});
							}}
							size="icon"
							className="w-12"
						>
							{locale === "en" ? "FR" : "EN"}
						</Button>
					</div>
				</div>
				<div className="py-4">
					<Outlet />
					<Toaster />
				</div>
			</main>
		</SidebarProvider>
	);
}
