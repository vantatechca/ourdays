"use client";

import * as React from "react";
import {
  Settings,
  Radar,
  Clock,
  Cpu,
  Key,
  Bell,
  Download,
  Eye,
  EyeOff,
  Save,
  FileJson,
  FileSpreadsheet,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockScraperStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

function scraperStatusDot(status: string) {
  return (
    <div
      className={cn(
        "size-2 rounded-full",
        status === "running"
          ? "animate-pulse bg-emerald-400"
          : status === "error"
            ? "bg-red-400"
            : "bg-muted-foreground/40"
      )}
    />
  );
}

function SourcesTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Monitored Sources</h3>
          <p className="text-xs text-muted-foreground">
            Configure data collection endpoints
          </p>
        </div>
        <Badge variant="secondary">
          {mockScraperStatus.length} sources
        </Badge>
      </div>

      <div className="space-y-2">
        {mockScraperStatus.map((source) => (
          <Card key={source.name} className="border-0 bg-card/60 backdrop-blur-sm">
            <CardContent className="flex items-center gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {scraperStatusDot(source.status)}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{source.name}</span>
                    <Badge variant="secondary" className="text-[10px]">
                      {source.platform}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    <span>Every {source.frequency}</span>
                    <span>{source.signalsTotal.toLocaleString()} signals</span>
                  </div>
                </div>
              </div>
              <Switch defaultChecked={source.status !== "error"} size="sm" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ScheduleTab() {
  const scheduleItems = [
    { source: "Reddit", frequency: "2h", description: "Scrape subreddits for peptide discussions" },
    { source: "Google Trends", frequency: "4h", description: "Fetch trending keyword data" },
    { source: "YouTube", frequency: "6h", description: "Monitor new video uploads and trends" },
    { source: "RSS/News", frequency: "1h", description: "Pull latest RSS feed items" },
    { source: "Etsy", frequency: "24h", description: "Scan competitor products and reviews" },
    { source: "Whop", frequency: "24h", description: "Check digital product listings" },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold">Scrape Schedule</h3>
        <p className="text-xs text-muted-foreground">
          Configure how often each source is polled
        </p>
      </div>

      <div className="space-y-3">
        {scheduleItems.map((item) => (
          <div
            key={item.source}
            className="flex items-center justify-between rounded-lg bg-card/60 p-3 ring-1 ring-foreground/10"
          >
            <div>
              <div className="text-sm font-medium">{item.source}</div>
              <p className="text-xs text-muted-foreground">
                {item.description}
              </p>
            </div>
            <Select defaultValue={item.frequency}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30m">30 min</SelectItem>
                <SelectItem value="1h">1 hour</SelectItem>
                <SelectItem value="2h">2 hours</SelectItem>
                <SelectItem value="4h">4 hours</SelectItem>
                <SelectItem value="6h">6 hours</SelectItem>
                <SelectItem value="12h">12 hours</SelectItem>
                <SelectItem value="24h">24 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    </div>
  );
}

function ModelsTab() {
  const tiers = [
    {
      tier: "Tier 1 - Fast Triage",
      description: "Quick classification and filtering of raw signals. High throughput, low cost.",
      model: "claude-3-haiku",
      options: ["claude-3-haiku", "gpt-4o-mini", "gemini-flash"],
    },
    {
      tier: "Tier 2 - Deep Analysis",
      description: "Detailed idea evaluation, scoring, and competitive analysis.",
      model: "claude-sonnet-4",
      options: ["claude-sonnet-4", "gpt-4o", "gemini-pro"],
    },
    {
      tier: "Tier 3 - Strategic",
      description: "Complex reasoning, rule suggestion, pattern discovery, and conversation.",
      model: "claude-opus-4",
      options: ["claude-opus-4", "gpt-4.5", "o3"],
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold">Model Configuration</h3>
        <p className="text-xs text-muted-foreground">
          Select AI models for each processing tier
        </p>
      </div>

      <div className="space-y-3">
        {tiers.map((tier) => (
          <Card key={tier.tier} className="border-0 bg-card/60 backdrop-blur-sm">
            <CardContent className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Cpu className="size-4 text-violet-400" />
                  <span className="text-sm font-medium">{tier.tier}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {tier.description}
                </p>
              </div>
              <Select defaultValue={tier.model}>
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tier.options.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ApiKeysTab() {
  const [visibleKeys, setVisibleKeys] = React.useState<Record<string, boolean>>({});

  const keys = [
    { name: "Anthropic API Key", key: "ANTHROPIC_API_KEY", value: "sk-ant-****...****7xBq" },
    { name: "OpenAI API Key", key: "OPENAI_API_KEY", value: "sk-****...****m9Pz" },
    { name: "Google Trends API", key: "GOOGLE_API_KEY", value: "AIza****...****Qx4R" },
    { name: "Reddit Client ID", key: "REDDIT_CLIENT_ID", value: "p8****...****nR2v" },
    { name: "Reddit Client Secret", key: "REDDIT_CLIENT_SECRET", value: "Xk****...****tL9m" },
    { name: "YouTube Data API", key: "YOUTUBE_API_KEY", value: "AIza****...****Hj7K" },
  ];

  const toggleVisibility = (keyName: string) => {
    setVisibleKeys((prev) => ({ ...prev, [keyName]: !prev[keyName] }));
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold">API Keys</h3>
        <p className="text-xs text-muted-foreground">
          Manage API credentials for integrations
        </p>
      </div>

      <div className="space-y-3">
        {keys.map((apiKey) => (
          <div
            key={apiKey.key}
            className="space-y-2 rounded-lg bg-card/60 p-3 ring-1 ring-foreground/10"
          >
            <Label className="text-xs">{apiKey.name}</Label>
            <div className="flex items-center gap-2">
              <Input
                type={visibleKeys[apiKey.key] ? "text" : "password"}
                value={apiKey.value}
                readOnly
                className="font-mono text-xs"
              />
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => toggleVisibility(apiKey.key)}
              >
                {visibleKeys[apiKey.key] ? (
                  <EyeOff className="size-3.5" />
                ) : (
                  <Eye className="size-3.5" />
                )}
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Save className="size-3" />
                Save
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationsTab() {
  const notifications = [
    { label: "New idea detected (score > 80)", description: "Get notified when a high-scoring idea is discovered", enabled: true },
    { label: "Scraper errors", description: "Alert when a data source fails to scrape", enabled: true },
    { label: "Competitor new product", description: "Notification when a tracked competitor lists a new product", enabled: true },
    { label: "Trend breakout detected", description: "Alert for keywords hitting breakout status", enabled: true },
    { label: "Weekly digest", description: "Summary of weekly activity, ideas, and trends", enabled: false },
    { label: "Rule suggestion available", description: "AI has identified a potential new golden rule", enabled: false },
    { label: "Pipeline status changes", description: "When ideas move between pipeline stages", enabled: true },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold">Notification Preferences</h3>
        <p className="text-xs text-muted-foreground">
          Configure which events trigger notifications
        </p>
      </div>

      <div className="space-y-2">
        {notifications.map((notif) => (
          <div
            key={notif.label}
            className="flex items-center justify-between rounded-lg bg-card/60 p-3 ring-1 ring-foreground/10"
          >
            <div>
              <div className="text-sm font-medium">{notif.label}</div>
              <p className="text-xs text-muted-foreground">
                {notif.description}
              </p>
            </div>
            <Switch defaultChecked={notif.enabled} size="sm" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ExportTab() {
  const exports = [
    {
      label: "Ideas",
      description: "Export all ideas with scores, statuses, and metadata",
      icon: <FileSpreadsheet className="size-4 text-emerald-400" />,
    },
    {
      label: "Feedback & Conversations",
      description: "Export conversation logs and feedback decisions",
      icon: <FileJson className="size-4 text-blue-400" />,
    },
    {
      label: "Golden Rules",
      description: "Export all rules with weights and application counts",
      icon: <FileJson className="size-4 text-violet-400" />,
    },
    {
      label: "Trend Data",
      description: "Export trend snapshots and historical keyword data",
      icon: <FileSpreadsheet className="size-4 text-amber-400" />,
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold">Export Data</h3>
        <p className="text-xs text-muted-foreground">
          Download your data in CSV or JSON format
        </p>
      </div>

      <div className="space-y-3">
        {exports.map((exp) => (
          <div
            key={exp.label}
            className="flex items-center justify-between rounded-lg bg-card/60 p-4 ring-1 ring-foreground/10"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-muted/60">
                {exp.icon}
              </div>
              <div>
                <div className="text-sm font-medium">{exp.label}</div>
                <p className="text-xs text-muted-foreground">
                  {exp.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="size-3" />
                CSV
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="size-3" />
                JSON
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <Settings className="size-6 text-muted-foreground" />
          Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Configure sources, schedules, models, and integrations
        </p>
      </div>

      <Separator />

      {/* Tabs */}
      <Tabs defaultValue="sources">
        <TabsList>
          <TabsTrigger value="sources" className="gap-1.5">
            <Radar className="size-3.5" />
            Sources
          </TabsTrigger>
          <TabsTrigger value="schedule" className="gap-1.5">
            <Clock className="size-3.5" />
            Schedule
          </TabsTrigger>
          <TabsTrigger value="models" className="gap-1.5">
            <Cpu className="size-3.5" />
            Models
          </TabsTrigger>
          <TabsTrigger value="api-keys" className="gap-1.5">
            <Key className="size-3.5" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5">
            <Bell className="size-3.5" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="export" className="gap-1.5">
            <Download className="size-3.5" />
            Export
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sources">
          <SourcesTab />
        </TabsContent>
        <TabsContent value="schedule">
          <ScheduleTab />
        </TabsContent>
        <TabsContent value="models">
          <ModelsTab />
        </TabsContent>
        <TabsContent value="api-keys">
          <ApiKeysTab />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationsTab />
        </TabsContent>
        <TabsContent value="export">
          <ExportTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
