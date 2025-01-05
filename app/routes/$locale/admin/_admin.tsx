import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/AlertDialog";
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
	Languages,
	LayoutDashboard,
	UserMinus,
	Utensils,
} from "lucide-react";
import { useState } from "react";
import { z } from "zod";

export const Route = createFileRoute("/$locale/admin/_admin")({
	component: RouteComponent,
	errorComponent: ErrorComponent,
	validateSearch: z.object({
		editingLocale: LocaleSchema.optional(),
		editing: z.boolean().optional(),
	}),
	beforeLoad: async ({ search, params }) => {
		if (!search.editingLocale) {
			throw redirect({
				to: "/$locale/admin",
				search: {
					editingLocale: params.locale as Locale,
				},
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
	const [alertOpen, setAlertOpen] = useState(false);
	const [editingLocale, setEditingLocale] = useState(search.editingLocale);
	const t = useTranslations(locale);

	return (
		<SidebarProvider>
			<Sidebar>
				<SidebarHeader />
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
								{t.admin.nav.settings}
							</SidebarGroupLabel>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<button
										onClick={() => {
											navigate({
												replace: true,
												params: {
													locale:
														locale === "en"
															? "fr"
															: "en",
												},
												search: (prev) => ({ ...prev }),
											});
										}}
									>
										<Languages />
										{t.admin.nav.localeToggle}
									</button>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<Link
										to="/$locale"
										params={{
											locale,
										}}
									>
										<ExternalLink />
										{t.admin.nav.exit}
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
						{search.editing && (
							<AlertDialog
								open={alertOpen}
								onOpenChange={setAlertOpen}
							>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>
											{t.admin.confirm.title}
										</AlertDialogTitle>
										<AlertDialogDescription>
											{t.admin.confirm.description}
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>
											{t.admin.confirm.cancel}
										</AlertDialogCancel>
										<AlertDialogAction
											onClick={() => {
												navigate({
													replace: true,
													search: (search) => ({
														...search,
														editingLocale,
														editing: false,
													}),
												});
											}}
										>
											{t.admin.confirm.confirm}
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						)}
						<Select
							value={search.editingLocale}
							onValueChange={(value) => {
								setEditingLocale(value as Locale);
								if (search.editing) {
									setAlertOpen(true);
								} else {
									navigate({
										replace: true,
										search: (search) => ({
											...search,
											editingLocale: value as Locale,
										}),
									});
								}
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
					</div>
				</div>
				<div className="py-4">
					<Outlet />
				</div>
			</main>
		</SidebarProvider>
	);
}
