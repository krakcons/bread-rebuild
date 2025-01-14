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
	useSidebar,
} from "@/components/ui/SideBar";
import { Toaster } from "@/components/ui/Sonner";
import { Locale, locales, LocaleSchema } from "@/lib/locale";
import { getMyProviderFn } from "@/server/actions/provider";
import { logoutFn } from "@/server/auth/actions";
import {
	createFileRoute,
	ErrorComponent,
	Link,
	Outlet,
	redirect,
	useParams,
} from "@tanstack/react-router";
import { useServerFn } from "@tanstack/start";
import {
	AlertCircle,
	BarChart,
	Building,
	ExternalLink,
	LayoutDashboard,
	UserMinus,
	Users,
	Utensils,
	X,
} from "lucide-react";
import { useTranslations } from "use-intl";
import { z } from "zod";

export const Route = createFileRoute("/$locale/admin/_admin")({
	component: RouteComponent,
	errorComponent: ErrorComponent,
	validateSearch: z.object({
		editingLocale: LocaleSchema.optional(),
	}),
	beforeLoad: async ({ search, params, location, context }) => {
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
		return context;
	},
	loader: async () => {
		const provider = await getMyProviderFn();
		if (!provider) {
			throw new Error("Provider not found");
		}
		return { provider };
	},
});

const AdminSidebar = () => {
	const logout = useServerFn(logoutFn);
	const { setOpenMobile, isMobile } = useSidebar();
	const search = Route.useSearch();
	const { user } = Route.useRouteContext();
	const t = useTranslations();
	const { locale } = useParams({
		from: "/$locale",
	});
	const { provider } = Route.useLoaderData();

	return (
		<Sidebar>
			<SidebarHeader className="flex flex-row items-center justify-between border-b">
				<Link
					to="/$locale"
					params={{
						locale,
					}}
					className="flex items-center gap-2"
				>
					<img src="/logo.png" alt="Bread Logo" className="w-10" />
					<p className="print font-semibold tracking-widest text-primary">
						BREAD
					</p>
				</Link>
				{isMobile && (
					<Button
						onClick={() => {
							setOpenMobile(false);
						}}
						variant="ghost"
						size="icon"
					>
						<X />
					</Button>
				)}
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarGroupLabel>
							{t("admin.nav.manage")}
						</SidebarGroupLabel>
						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<Link
									to="/$locale/admin"
									params={{
										locale,
									}}
									search={search}
									onClick={() => {
										setOpenMobile(false);
									}}
								>
									<LayoutDashboard />
									{t("admin.nav.dashboard")}
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<Link
									to="/$locale/admin/listings/list"
									params={{
										locale,
									}}
									search={search}
									replace
									onClick={() => {
										setOpenMobile(false);
									}}
								>
									<Utensils />
									{t("admin.nav.listings")}
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<Link
									to="/$locale/admin/providers/me"
									params={{
										locale,
									}}
									search={search}
									onClick={() => {
										setOpenMobile(false);
									}}
								>
									<Building />
									{t("admin.nav.provider")}
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
									onClick={() => {
										setOpenMobile(false);
									}}
								>
									<BarChart />
									{t("admin.nav.analytics")}
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarGroupContent>
				</SidebarGroup>
				{user?.role === "admin" && (
					<SidebarGroup>
						<SidebarGroupContent>
							<SidebarGroupLabel>
								{t("admin.nav.admin")}
							</SidebarGroupLabel>
						</SidebarGroupContent>
						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<Link
									to="/$locale/admin/providers/list"
									params={{
										locale,
									}}
									search={search}
									onClick={() => {
										setOpenMobile(false);
									}}
								>
									<Users />
									{t("admin.nav.providers")}
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarGroup>
				)}
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarGroupLabel>
							{t("admin.nav.account")}
						</SidebarGroupLabel>
						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<button
									onClick={() => {
										logout();
									}}
								>
									<UserMinus />
									{t("admin.nav.logout")}
								</button>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<div className="flex flex-col gap-1">
					<p className="text-sm font-semibold">{provider.name}</p>
					<p className="text-xs text-muted-foreground">
						{user?.email}
					</p>
				</div>
				{provider.status === "pending" && (
					<div className="flex flex-col gap-1 border p-2">
						<div className="flex flex-row items-center gap-1">
							<AlertCircle size={18} />
							<p className="font-semibold">
								{t("admin.verificationPending.title")}
							</p>
						</div>
						<p className="text-sm text-muted-foreground">
							{t("admin.verificationPending.description")}
						</p>
					</div>
				)}
				<Link
					to="/$locale"
					params={{
						locale,
					}}
					className={buttonVariants()}
				>
					<ExternalLink />
					{t("admin.nav.exit")}
				</Link>
			</SidebarFooter>
		</Sidebar>
	);
};

function RouteComponent() {
	const { locale } = Route.useParams();
	const search = Route.useSearch();
	const navigate = Route.useNavigate();
	const t = useTranslations();

	return (
		<SidebarProvider>
			<AdminSidebar />
			<main className="flex-1">
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
							<SelectTrigger>
								<p className="text-sm text-muted-foreground">
									{t("admin.editing")}
								</p>
								<SelectValue />
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
