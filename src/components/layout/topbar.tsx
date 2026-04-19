"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Bell, Settings, Filter, X, Lightbulb, TrendingUp, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { mockIdeas, mockTrends, mockCompetitors } from "@/lib/mock-data"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
interface TopbarProps {
  sidebarCollapsed: boolean
}

interface Notification {
  id: string
  title: string
  desc: string
  timestamp: number
}

const filterOptions: Record<string, string[]> = {
  Status: ["Detected", "Reviewing", "Approved", "Declined", "Archived"],
  Category: ["Ebook", "Course", "SaaS Tool", "Template", "AI App"],
  Priority: ["High", "Medium", "Low"],
  "Date Range": ["Today", "Last 7 days", "Last 30 days", "Last 90 days"],
}

const initialNotifications: Notification[] = [
  { id: "n1", title: "New idea detected", desc: "Retatrutide trending up 890% in last 30 days", timestamp: Date.now() - 300000 },
  { id: "n2", title: "Competitor alert", desc: "BiohackPro launched a new course at $49.99", timestamp: Date.now() - 900000 },
  { id: "n3", title: "Weekly digest ready", desc: "9 new ideas this week, 3 scored above 80", timestamp: Date.now() - 3600000 },
  { id: "n4", title: "Scraper completed", desc: "Reddit scraper finished, 24 new signals", timestamp: Date.now() - 7200000 },
  { id: "n5", title: "Golden rule suggestion", desc: "New pattern detected based on recent decisions", timestamp: Date.now() - 10800000 },
]

const incomingNotifications: Omit<Notification, "id" | "timestamp">[] = [
  { title: "New trend spike", desc: "Tirzepatide mentions up 340% in the last hour" },
  { title: "New idea scored", desc: "BPC-157 Stack Builder scored 88 composite" },
  { title: "Source check failed", desc: "Reddit API rate limit hit, retrying in 5min" },
  { title: "Compliance flag raised", desc: "Melanotan II product flagged yellow" },
  { title: "New competitor found", desc: "PeptideLabs joined Etsy with 12 products" },
  { title: "AI model updated", desc: "Brain switched to claude-opus-4-7 for analysis" },
  { title: "Deep dive ready", desc: "Full report on CJC-1295 is ready to view" },
]

function formatNotifTime(ts: number): string {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export function Topbar({ sidebarCollapsed }: TopbarProps) {
  const [showNotifications, setShowNotifications] = React.useState(false)
  const [notifications, setNotifications] = React.useState<Notification[]>(initialNotifications)
  const [showFilter, setShowFilter] = React.useState(false)
  const [activeFilter, setActiveFilter] = React.useState<{ type: string; value: string } | null>(null)
  const [openSubmenu, setOpenSubmenu] = React.useState<string | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [showSearchResults, setShowSearchResults] = React.useState(false)
  const [showProfile, setShowProfile] = React.useState(false)
  const notifRef = React.useRef<HTMLDivElement>(null)
  const filterRef = React.useRef<HTMLDivElement>(null)
  const searchRef = React.useRef<HTMLDivElement>(null)
  const profileRef = React.useRef<HTMLDivElement>(null)
  const router = useRouter()

  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return { ideas: [], trends: [], competitors: [] }
    const q = searchQuery.toLowerCase()
    return {
      ideas: mockIdeas
        .filter((i) => i.title.toLowerCase().includes(q) || i.summary.toLowerCase().includes(q))
        .slice(0, 5),
      trends: mockTrends.filter((t) => t.keyword.toLowerCase().includes(q)).slice(0, 3),
      competitors: mockCompetitors.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 3),
    }
  }, [searchQuery])

  const hasResults =
    searchResults.ideas.length > 0 ||
    searchResults.trends.length > 0 ||
    searchResults.competitors.length > 0

  React.useEffect(() => {
    const interval = setInterval(() => {
      const random = incomingNotifications[Math.floor(Math.random() * incomingNotifications.length)]
      const newNotif: Notification = {
        id: `n-${Date.now()}`,
        title: random.title,
        desc: random.desc,
        timestamp: Date.now(),
      }
      setNotifications((prev) => [newNotif, ...prev].slice(0, 20))
    }, 20000)
    return () => clearInterval(interval)
  }, [])

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilter(false)
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchResults(false)
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false)
      }
    }
    if (showNotifications || showFilter || showSearchResults || showProfile) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showNotifications, showFilter, showSearchResults, showProfile])

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur-sm transition-all duration-300",
        sidebarCollapsed ? "left-16" : "left-60"
      )}
    >
      {/* Search */}
      <div className="relative flex-1 max-w-md" ref={searchRef}>
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search peptides, ideas, trends..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setShowSearchResults(true)
          }}
          onFocus={() => setShowSearchResults(true)}
          className="h-8 pl-9 bg-muted/50 border-transparent focus-visible:border-ring"
        />
        {showSearchResults && searchQuery.trim() && (
          <div className="absolute left-0 right-0 top-full mt-2 rounded-lg border border-border bg-popover p-1 shadow-lg ring-1 ring-foreground/10 z-50 max-h-96 overflow-y-auto">
            {!hasResults ? (
              <div className="px-3 py-4 text-center text-xs text-muted-foreground">
                No results for &quot;{searchQuery}&quot;
              </div>
            ) : (
              <>
                {searchResults.ideas.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-semibold uppercase text-muted-foreground">
                      <Lightbulb className="size-3" />
                      Ideas
                    </div>
                    {searchResults.ideas.map((idea) => (
                      <button
                        key={idea.id}
                        onClick={() => {
                          router.push(`/ideas/${idea.slug}`)
                          setShowSearchResults(false)
                          setSearchQuery("")
                        }}
                        className="flex w-full flex-col items-start gap-0.5 rounded-md px-2 py-1.5 text-left hover:bg-accent transition-colors"
                      >
                        <span className="text-sm font-medium truncate w-full">{idea.title}</span>
                        <span className="text-xs text-muted-foreground truncate w-full">{idea.summary}</span>
                      </button>
                    ))}
                  </div>
                )}
                {searchResults.trends.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-semibold uppercase text-muted-foreground">
                      <TrendingUp className="size-3" />
                      Trends
                    </div>
                    {searchResults.trends.map((trend) => (
                      <button
                        key={trend.keyword}
                        onClick={() => {
                          router.push("/trends")
                          setShowSearchResults(false)
                          setSearchQuery("")
                        }}
                        className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left hover:bg-accent transition-colors"
                      >
                        <span className="text-sm font-medium">{trend.keyword}</span>
                        <span className="text-xs text-muted-foreground">
                          {trend.value} • {trend.direction}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
                {searchResults.competitors.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-semibold uppercase text-muted-foreground">
                      <Users className="size-3" />
                      Competitors
                    </div>
                    {searchResults.competitors.map((comp) => (
                      <button
                        key={comp.id}
                        onClick={() => {
                          router.push("/competitors")
                          setShowSearchResults(false)
                          setSearchQuery("")
                        }}
                        className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left hover:bg-accent transition-colors"
                      >
                        <span className="text-sm font-medium">{comp.name}</span>
                        <span className="text-xs text-muted-foreground">{comp.platform}</span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Filter Dropdown */}
      <div className="relative" ref={filterRef}>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => {
            setShowFilter((prev) => !prev)
            setOpenSubmenu(null)
          }}
        >
          <Filter className="size-3.5" />
          <span className="hidden sm:inline">
            {activeFilter ? `${activeFilter.type}: ${activeFilter.value}` : "Filter"}
          </span>
        </Button>
        {showFilter && (
          <div className="absolute right-0 top-full mt-2 w-52 rounded-lg border border-border bg-popover p-1 shadow-lg ring-1 ring-foreground/10 z-50">
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
              {openSubmenu ? openSubmenu : "Filter by"}
            </div>
            <div className="h-px bg-border my-1" />
            {openSubmenu === null
              ? Object.keys(filterOptions).map((option) => (
                  <button
                    key={option}
                    onClick={() => setOpenSubmenu(option)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent transition-colors",
                      activeFilter?.type === option && "bg-accent/50"
                    )}
                  >
                    <span>{option}</span>
                    <span className="text-muted-foreground">›</span>
                  </button>
                ))
              : (
                <>
                  <button
                    onClick={() => setOpenSubmenu(null)}
                    className="w-full rounded-md px-2 py-1.5 text-left text-xs text-muted-foreground hover:bg-accent transition-colors"
                  >
                    ‹ Back
                  </button>
                  {filterOptions[openSubmenu].map((value) => (
                    <button
                      key={value}
                      onClick={() => {
                        setActiveFilter({ type: openSubmenu, value })
                        setShowFilter(false)
                        setOpenSubmenu(null)
                      }}
                      className={cn(
                        "w-full rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent transition-colors",
                        activeFilter?.type === openSubmenu &&
                          activeFilter.value === value &&
                          "bg-accent"
                      )}
                    >
                      {value}
                    </button>
                  ))}
                </>
              )}
            {activeFilter && openSubmenu === null && (
              <>
                <div className="h-px bg-border my-1" />
                <button
                  onClick={() => {
                    setActiveFilter(null)
                    setShowFilter(false)
                  }}
                  className="w-full rounded-md px-2 py-1.5 text-left text-xs text-muted-foreground hover:text-destructive hover:bg-accent transition-colors"
                >
                  Clear filter
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex-1" />

      {/* Right Actions */}
      <div className="flex items-center gap-1">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setShowNotifications((prev) => !prev)}
          >
            <Bell className="size-4" />
            {notifications.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-white">
                {notifications.length}
              </span>
            )}
            <span className="sr-only">Notifications</span>
          </Button>
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-lg border border-border bg-popover p-1 shadow-lg ring-1 ring-foreground/10 z-50">
              <div className="flex items-center justify-between px-2 py-1.5">
                <span className="text-sm font-semibold">Notifications</span>
                {notifications.length > 0 && (
                  <button
                    onClick={() => setNotifications([])}
                    className="text-[10px] text-muted-foreground hover:text-destructive transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="h-px bg-border my-1" />
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-2 py-6 text-center text-xs text-muted-foreground">
                    No notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className="group flex items-start gap-1 rounded-md px-2 py-1.5 hover:bg-accent transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex w-full items-center justify-between gap-2">
                          <span className="text-sm font-medium">{n.title}</span>
                          <span className="text-[10px] text-muted-foreground shrink-0">{formatNotifTime(n.timestamp)}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{n.desc}</span>
                      </div>
                      <button
                        onClick={() =>
                          setNotifications((prev) => prev.filter((item) => item.id !== n.id))
                        }
                        className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-all shrink-0"
                        aria-label="Remove notification"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <Button variant="ghost" size="icon" nativeButton={false} render={<Link href="/settings" />}>
          <Settings className="size-4" />
          <span className="sr-only">Settings</span>
        </Button>

        {/* User Avatar */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile((prev) => !prev)}
            className="ml-1 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Avatar size="sm">
              <AvatarImage src="" alt="User" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </button>
          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-border bg-popover p-1 shadow-lg ring-1 ring-foreground/10 z-50">
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                My Account
              </div>
              <div className="h-px bg-border my-1" />
              <button
                onClick={() => {
                  setShowProfile(false)
                  router.push("/profile")
                }}
                className="w-full rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent transition-colors"
              >
                Profile
              </button>
              <button
                onClick={() => {
                  setShowProfile(false)
                  router.push("/settings")
                }}
                className="w-full rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent transition-colors"
              >
                Preferences
              </button>
              <div className="h-px bg-border my-1" />
              <button
                onClick={() => {
                  setShowProfile(false)
                  alert("Logged out successfully!")
                }}
                className="w-full rounded-md px-2 py-1.5 text-left text-sm text-red-400 hover:bg-accent hover:text-red-300 transition-colors"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
