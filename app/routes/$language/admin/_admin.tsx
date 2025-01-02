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
import { logoutFn } from "@/server/auth/actions";
import {
	createFileRoute,
	ErrorComponent,
	Link,
	Outlet,
} from "@tanstack/react-router";
import { useServerFn } from "@tanstack/start";
import {
	BarChart,
	Building,
	LayoutDashboard,
	UserMinus,
	Utensils,
} from "lucide-react";

export const Route = createFileRoute("/$language/admin/_admin")({
	component: RouteComponent,
	errorComponent: ErrorComponent,
});

function RouteComponent() {
	const logout = useServerFn(logoutFn);
	const { language } = Route.useParams();
	return (
		<SidebarProvider>
			<Sidebar>
				<SidebarHeader />
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupContent>
							<SidebarGroupLabel>Admin</SidebarGroupLabel>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<Link
										to="/$language/admin"
										params={{
											language,
										}}
									>
										<LayoutDashboard />
										Dashboard
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<Link
										to="/$language/admin"
										params={{
											language,
										}}
									>
										<Utensils />
										Listings
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<Link
										to="/$language/admin/provider"
										params={{
											language,
										}}
									>
										<Building />
										Provider
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<Link
										to="/$language/admin/analytics"
										params={{
											language,
										}}
									>
										<BarChart />
										Analytics
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarGroupContent>
					</SidebarGroup>
					<SidebarGroup>
						<SidebarGroupContent>
							<SidebarGroupLabel>Account</SidebarGroupLabel>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<button
										onClick={() => {
											logout();
										}}
									>
										<UserMinus />
										Logout
									</button>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
				<SidebarFooter />
			</Sidebar>
			<main className="flex-1 p-4">
				<SidebarTrigger />
				<div className="py-4">
					<Outlet />
				</div>
			</main>
		</SidebarProvider>
	);
}
