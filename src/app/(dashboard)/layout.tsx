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
  const [chatOpen, setChatOpen] = React.useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
      />
      <Topbar sidebarCollapsed={sidebarCollapsed} />
      <ChatPanel open={chatOpen} onToggle={() => setChatOpen((prev) => !prev)} />

      <main
        className={cn(
          "pt-14 transition-all duration-300",
          sidebarCollapsed ? "pl-16" : "pl-60",
          chatOpen ? "pr-[360px]" : "pr-0"
        )}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
