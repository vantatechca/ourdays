"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Lightbulb,
  Brain,
  TrendingUp,
  Users,
  Shield,
  Kanban,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Ideas",
    href: "/ideas",
    icon: Lightbulb,
    badge: 3,
  },
  {
    label: "Brain Chat",
    href: "/brain-chat",
    icon: Brain,
  },
  {
    label: "Trends",
    href: "/trends",
    icon: TrendingUp,
  },
  {
    label: "Competitors",
    href: "/competitors",
    icon: Users,
  },
  {
    label: "Rules",
    href: "/rules",
    icon: Shield,
  },
  {
    label: "Pipeline",
    href: "/pipeline",
    icon: Kanban,
  },
]

const bottomNavItems: NavItem[] = [
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <TooltipProvider delay={300}>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex flex-col border-r border-border bg-card transition-all duration-300",
          collapsed ? "w-16" : "w-60"
        )}
      >
        {/* Logo */}
        <div className="flex h-14 items-center gap-2 border-b border-border px-4">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            P
          </div>
          {!collapsed && (
            <>
              <span className="text-base font-semibold tracking-tight text-foreground">
                PeptideIQ
              </span>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={onToggle}
                className="ml-auto text-muted-foreground hover:text-foreground"
                title="Collapse sidebar"
              >
                <ChevronLeft className="size-3.5" />
              </Button>
            </>
          )}
        </div>
        {collapsed && (
          <button
            onClick={onToggle}
            className="absolute -right-3 top-16 z-10 flex size-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm hover:bg-accent hover:text-foreground transition-colors"
            title="Expand sidebar"
          >
            <ChevronRight className="size-3.5" />
          </button>
        )}

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-3">
          <ul className="flex flex-col gap-0.5">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href)
              const Icon = item.icon

              return (
                <li key={item.href}>
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Link
                          href={item.href}
                          className={cn(
                            "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                            isActive
                              ? "bg-accent text-accent-foreground"
                              : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                            collapsed && "justify-center px-2"
                          )}
                        />
                      }
                    >
                      <Icon className="size-4 shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="flex-1">{item.label}</span>
                          {item.badge != null && (
                            <Badge
                              variant="secondary"
                              className="ml-auto h-5 min-w-5 px-1.5 text-[10px] font-semibold"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                      {collapsed && item.badge != null && (
                        <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                          {item.badge}
                        </span>
                      )}
                    </TooltipTrigger>
                    {collapsed && (
                      <TooltipContent side="right">
                        {item.label}
                        {item.badge != null && ` (${item.badge})`}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Bottom Navigation */}
        <div className="px-2 pb-2">
          <Separator className="mb-2" />
          <ul className="flex flex-col gap-0.5">
            {bottomNavItems.map((item) => {
              const isActive = pathname.startsWith(item.href)
              const Icon = item.icon

              return (
                <li key={item.href}>
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Link
                          href={item.href}
                          className={cn(
                            "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                            isActive
                              ? "bg-accent text-accent-foreground"
                              : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                            collapsed && "justify-center px-2"
                          )}
                        />
                      }
                    >
                      <Icon className="size-4 shrink-0" />
                      {!collapsed && <span>{item.label}</span>}
                    </TooltipTrigger>
                    {collapsed && (
                      <TooltipContent side="right">
                        {item.label}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </li>
              )
            })}
          </ul>

        </div>
      </aside>
    </TooltipProvider>
  )
}
