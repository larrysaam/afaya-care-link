import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  FileText, 
  Home, 
  ChevronLeft,
  Building2
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const adminNavItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
    roles: ["admin", "superadmin", "consultation_admin", "visa_admin", "accommodation_admin"],
  },
  {
    title: "Hospitals",
    url: "/admin/hospitals",
    icon: Building2,
    roles: ["admin", "superadmin"],
  },
  {
    title: "Consultations",
    url: "/admin/consultations",
    icon: Calendar,
    roles: ["admin", "superadmin", "consultation_admin"],
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: Users,
    roles: ["superadmin"],
  },
  {
    title: "Visa Requests",
    url: "/admin/visa",
    icon: FileText,
    roles: ["admin", "superadmin", "visa_admin"],
  },
  {
    title: "Accommodations",
    url: "/admin/accommodations",
    icon: Home,
    roles: ["admin", "superadmin", "accommodation_admin"],
  },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { hasRole, isSuperAdmin } = useAuth();
  const collapsed = state === "collapsed";

  const accessibleItems = adminNavItems.filter(
    (item) => isSuperAdmin || item.roles.some((role) => hasRole(role as any))
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <span className="font-semibold text-foreground">Admin Panel</span>
          )}
          <SidebarTrigger className={cn(collapsed && "mx-auto")}>
            <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
          </SidebarTrigger>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={cn(collapsed && "sr-only")}>
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accessibleItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={collapsed ? item.title : undefined}
                    >
                      <NavLink
                        to={item.url}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                          isActive
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        <NavLink
          to="/"
          className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Home className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Back to Site</span>}
        </NavLink>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AdminSidebar;
