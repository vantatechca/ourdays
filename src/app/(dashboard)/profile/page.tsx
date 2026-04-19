"use client"

import * as React from "react"
import { toast } from "sonner"
import { User, Mail, Briefcase, Save, Camera, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ProfilePage() {
  const [name, setName] = React.useState("Aldwane Dizon")
  const [email, setEmail] = React.useState("vantatechca@gmail.com")
  const [role, setRole] = React.useState("owner")
  const [bio, setBio] = React.useState(
    "Building PeptideIQ — discovering peptide product opportunities through AI-powered trend analysis."
  )
  const [avatarUrl, setAvatarUrl] = React.useState<string>("")
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleSave = () => {
    toast.success("Profile updated successfully!")
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB")
      return
    }
    const reader = new FileReader()
    reader.onload = (event) => {
      setAvatarUrl(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveAvatar = () => {
    setAvatarUrl("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Page Header */}
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <User className="size-6 text-blue-400" />
          Profile
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your personal information and account details
        </p>
      </div>

      <Separator />

      {/* Avatar + Basic Info */}
      <Card className="border-0 bg-card/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-base">Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar size="lg" className="size-20">
                <AvatarImage src={avatarUrl} alt={name} />
                <AvatarFallback className="text-xl">
                  {name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
                title="Upload photo"
              >
                <Camera className="size-3.5" />
              </button>
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">{name}</h2>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="capitalize">
                  {role}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Joined April 2026
                </span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Button
                  variant="outline"
                  size="xs"
                  className="gap-1"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="size-3" />
                  {avatarUrl ? "Change photo" : "Upload photo"}
                </Button>
                {avatarUrl && (
                  <Button
                    variant="ghost"
                    size="xs"
                    className="gap-1 text-destructive hover:text-destructive"
                    onClick={handleRemoveAvatar}
                  >
                    <Trash2 className="size-3" />
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="role" className="text-xs">
                Role
              </Label>
              <div className="relative">
                <Briefcase className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-background pl-8 pr-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="owner">Owner</option>
                  <option value="member">Member</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio" className="text-xs">
              Bio
            </Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Activity Stats */}
      <Card className="border-0 bg-card/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-base">Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg bg-muted/40 p-3 text-center">
              <div className="text-xl font-bold tabular-nums">47</div>
              <div className="text-xs text-muted-foreground">Ideas Reviewed</div>
            </div>
            <div className="rounded-lg bg-muted/40 p-3 text-center">
              <div className="text-xl font-bold tabular-nums text-emerald-400">
                18
              </div>
              <div className="text-xs text-muted-foreground">Approved</div>
            </div>
            <div className="rounded-lg bg-muted/40 p-3 text-center">
              <div className="text-xl font-bold tabular-nums text-red-400">
                12
              </div>
              <div className="text-xs text-muted-foreground">Declined</div>
            </div>
            <div className="rounded-lg bg-muted/40 p-3 text-center">
              <div className="text-xl font-bold tabular-nums text-violet-400">
                9
              </div>
              <div className="text-xs text-muted-foreground">Golden Rules</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Cancel
        </Button>
        <Button onClick={handleSave} className="gap-2">
          <Save className="size-4" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}