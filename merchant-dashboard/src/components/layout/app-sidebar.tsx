"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  UtensilsCrossed,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const navItems = [
  {
    title: "Visão geral",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Lojas",
    href: "/dashboard/stores",
    icon: Store,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-border/80 bg-card shadow-sm">
      <div className="flex h-16 items-center gap-3 px-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-orange-600 text-primary-foreground shadow-md shadow-primary/30">
          <UtensilsCrossed className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-bold leading-none tracking-tight">
            FoodDash
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Merchant Portal</p>
        </div>
      </div>

      <Separator className="bg-border/60" />

      <nav className="flex-1 space-y-1.5 p-4">
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Menu
        </p>
        {navItems.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "nav-link",
                active ? "nav-link-active" : "nav-link-inactive"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border/60 bg-muted/30 p-4">
        <p className="rounded-lg bg-accent/60 px-3 py-2.5 text-xs leading-relaxed text-accent-foreground">
          Cada merchant vê apenas as suas lojas e produtos.
        </p>
      </div>
    </aside>
  );
}
