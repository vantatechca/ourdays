"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import { ChatPanel } from "@/components/layout/chat-panel"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [chatOpen, setChatOpen] = React.useState(false)

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(false)
        setMobileMenuOpen(false)
      }
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <Topbar
        sidebarCollapsed={sidebarCollapsed}
        onMobileMenuOpen={() => setMobileMenuOpen(true)}
      />
      <ChatPanel open={chatOpen} onToggle={() => setChatOpen((prev) => !prev)} />

      <main
        className={cn(
          "pt-14 transition-all duration-300",
          "pl-0",
          sidebarCollapsed ? "md:pl-16" : "md:pl-60",
          chatOpen ? "md:pr-[360px]" : "pr-0"
        )}
      >
        <div className="p-4 md:p-6">{children}</div>
      </main>
    </div>
  )
}
