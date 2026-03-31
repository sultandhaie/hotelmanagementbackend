import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  ChevronDown,
  LayoutDashboard,
  BedDouble,
  Users,
  Calendar,
  UsersIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  href: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Gestion de Stock",
    items: [
      {
        label: "Produits",
        href: "/stock/products",
      },
      {
        label: "Catégories",
        href: "/stock/categories",
      },
      {
        label: "Entrées de Stock",
        href: "/stock/entries",
      },
      {
        label: "Sorties de Stock",
        href: "/stock/exits",
      },
      {
        label: "Inventaire",
        href: "/stock/inventory",
      },
    ],
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <Image
          src="/logo.png"
          alt="Golden Hills Hotel"
          width={350}
          height={350}
          priority
        />
      </SidebarHeader>

      <SidebarContent className="w-10/12 mx-auto">
        {/* Dashboard */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="mb-1" asChild>
              <Link
                href="/"
                className="flex items-center gap-2 text-lg font-medium"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href="/clients"
                className="flex items-center gap-2 text-lg font-medium"
              >
                <UsersIcon size={18} />
                Gestion des Clients
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="mb-1" asChild>
              <Link
                href="/rooms"
                className="flex items-center gap-2 text-lg font-medium"
              >
                <BedDouble size={18} />
                Gestion des Chambres
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href="/reservation"
                className="flex items-center gap-2 text-lg font-medium"
              >
                <Calendar size={18} />
                Gestion des Reservations
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                Gestion de Stock
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent className="font-medium">
                <SidebarMenu>
                  {/*
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href="/stock/dashboard">Dashboard</Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  */}

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/stock/products">Produits</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/stock/entries">Entrées de Stock</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/stock/exits">Sorties de Stock</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/stock/inventory">Inventaire</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                Parametres de Stock
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent className="font-medium">
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/stock/unite">Unités</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/stock/depot">Depot</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/stock/categories">Catégories</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/stock/fournisseur">Fournisseurs</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="flex items-center gap-2">
              <Users size={16} />
              <span>Username</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
