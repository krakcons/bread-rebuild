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
import { Locale, locales, LocaleSchema } from "@/lib/locale";
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
	Languages,
	LayoutDashboard,
	UserMinus,
	Utensils,
} from "lucide-react";
import { useState } from "react";
import { z } from "zod";

const en = {
	admin: "Admin",
	dashboard: "Dashboard",
	listings: "Listings",
	provider: "Provider",
	analytics: "Analytics",
	settings: "Settings",
	localeToggle: "Français",
	account: "Account",
	logout: "Logout",
	editing: "Editing:",
	confirm: {
		title: "Leave without saving?",
		description:
			"Your changes have not been saved. If you leave, you will lose your changes.",
		confirm: "Confirm",
		cancel: "Cancel",
	},
};

const fr: typeof en = {
	localeToggle: "English",
	admin: "Admin",
	dashboard: "Tableau de bord",
	listings: "Annonces",
	provider: "Fournisseurs",
	analytics: "Analytiques",
	settings: "Paramètres",
	account: "Compte",
	logout: "Déconnexion",
	editing: "Edition :",
	confirm: {
		title: "Quitter sans enregistrer?",
		description:
			"Vos modifications n'ont pas été enregistrées. Si vous quittez, vous perdrez vos modifications.",
		confirm: "Confirmer",
		cancel: "Annuler",
	},
};

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
	loader: async ({ params: { locale } }) => {
		return {
			pt: locale === "en" ? en : fr,
		};
	},
});

function RouteComponent() {
	const logout = useServerFn(logoutFn);
	const { locale } = Route.useParams();
	const search = Route.useSearch();
	const { pt } = Route.useLoaderData();
	const navigate = Route.useNavigate();
	const [alertOpen, setAlertOpen] = useState(false);
	const [editingLocale, setEditingLocale] = useState(search.editingLocale);

	return (
		<SidebarProvider>
			<Sidebar>
				<SidebarHeader />
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupContent>
							<SidebarGroupLabel>{pt.admin}</SidebarGroupLabel>
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
										{pt.dashboard}
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<Link
										to="/$locale/admin"
										params={{
											locale,
										}}
										search={search}
									>
										<Utensils />
										{pt.listings}
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
										{pt.provider}
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
										{pt.analytics}
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarGroupContent>
					</SidebarGroup>
					<SidebarGroup>
						<SidebarGroupContent>
							<SidebarGroupLabel>{pt.settings}</SidebarGroupLabel>
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
										{pt.localeToggle}
									</button>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarGroupContent>
					</SidebarGroup>
					<SidebarGroup>
						<SidebarGroupContent>
							<SidebarGroupLabel>{pt.account}</SidebarGroupLabel>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<button
										onClick={() => {
											logout();
										}}
									>
										<UserMinus />
										{pt.logout}
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
											{pt.confirm.title}
										</AlertDialogTitle>
										<AlertDialogDescription>
											{pt.confirm.description}
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>
											{pt.confirm.cancel}
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
											{pt.confirm.confirm}
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
									{pt.editing}
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
