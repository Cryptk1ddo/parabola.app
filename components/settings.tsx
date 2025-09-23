"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Palette,
  Database,
  Smartphone,
  Moon,
  Sun,
  Monitor,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  Zap,
  Target,
} from "lucide-react"

interface UserSettings {
  profile: {
    name: string
    email: string
    timezone: string
  }
  preferences: {
    theme: "light" | "dark" | "system"
    soundEnabled: boolean
    notificationsEnabled: boolean
    focusReminders: boolean
    dailyGoalReminders: boolean
    weeklyReports: boolean
  }
  performance: {
    defaultFocusTime: number
    breakTime: number
    longBreakTime: number
    autoStartBreaks: boolean
    autoStartFocus: boolean
  }
  mobile: {
    hapticFeedback: boolean
    reducedMotion: boolean
    largeText: boolean
    highContrast: boolean
  }
  data: {
    autoBackup: boolean
    dataRetention: number
    exportFormat: "json" | "csv"
  }
}

const defaultSettings: UserSettings = {
  profile: {
    name: "Productivity Master",
    email: "user@example.com",
    timezone: "UTC-8",
  },
  preferences: {
    theme: "dark",
    soundEnabled: true,
    notificationsEnabled: true,
    focusReminders: true,
    dailyGoalReminders: true,
    weeklyReports: true,
  },
  performance: {
    defaultFocusTime: 25,
    breakTime: 5,
    longBreakTime: 15,
    autoStartBreaks: false,
    autoStartFocus: false,
  },
  mobile: {
    hapticFeedback: true,
    reducedMotion: false,
    largeText: false,
    highContrast: false,
  },
  data: {
    autoBackup: true,
    dataRetention: 90,
    exportFormat: "json",
  },
}

export function Settings() {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings)
  const [activeTab, setActiveTab] = useState("profile")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const updateSettings = (section: keyof UserSettings, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }))
    setHasUnsavedChanges(true)
  }

  const saveSettings = () => {
    // In a real app, this would save to a backend
    console.log("Saving settings:", settings)
    setHasUnsavedChanges(false)
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
    setHasUnsavedChanges(true)
  }

  const exportData = () => {
    const dataStr = JSON.stringify(settings, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "parabola-settings.json"
    link.click()
  }

  return (
    <div className="space-y-6 px-4 md:px-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-balance">Settings</h1>
          <p className="text-muted-foreground text-pretty text-sm md:text-base">
            Customize your productivity experience
          </p>
        </div>
        {hasUnsavedChanges && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={resetSettings}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button size="sm" onClick={saveSettings}>
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Preferences</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="gap-2">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Performance</span>
          </TabsTrigger>
          <TabsTrigger value="mobile" className="gap-2">
            <Smartphone className="h-4 w-4" />
            <span className="hidden sm:inline">Mobile</span>
          </TabsTrigger>
          <TabsTrigger value="data" className="gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Data</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>Manage your account details and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input
                    id="name"
                    value={settings.profile.name}
                    onChange={(e) => updateSettings("profile", "name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.profile.email}
                    onChange={(e) => updateSettings("profile", "email", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={settings.profile.timezone}
                  onValueChange={(value) => updateSettings("profile", "timezone", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                    <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                    <SelectItem value="UTC+0">Greenwich Mean Time (UTC+0)</SelectItem>
                    <SelectItem value="UTC+1">Central European Time (UTC+1)</SelectItem>
                    <SelectItem value="UTC+9">Japan Standard Time (UTC+9)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance & Notifications
              </CardTitle>
              <CardDescription>Customize how the app looks and behaves</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Theme</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "light", icon: Sun, label: "Light" },
                    { value: "dark", icon: Moon, label: "Dark" },
                    { value: "system", icon: Monitor, label: "System" },
                  ].map((theme) => {
                    const Icon = theme.icon
                    return (
                      <Button
                        key={theme.value}
                        variant={settings.preferences.theme === theme.value ? "default" : "outline"}
                        size="sm"
                        className="h-auto p-3 flex flex-col gap-1"
                        onClick={() => updateSettings("preferences", "theme", theme.value)}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-xs">{theme.label}</span>
                      </Button>
                    )
                  })}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sound Effects</Label>
                    <p className="text-sm text-muted-foreground">Play sounds for timer and notifications</p>
                  </div>
                  <Switch
                    checked={settings.preferences.soundEnabled}
                    onCheckedChange={(checked) => updateSettings("preferences", "soundEnabled", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications for important events</p>
                  </div>
                  <Switch
                    checked={settings.preferences.notificationsEnabled}
                    onCheckedChange={(checked) => updateSettings("preferences", "notificationsEnabled", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Focus Reminders</Label>
                    <p className="text-sm text-muted-foreground">Get reminded to start focus sessions</p>
                  </div>
                  <Switch
                    checked={settings.preferences.focusReminders}
                    onCheckedChange={(checked) => updateSettings("preferences", "focusReminders", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Daily Goal Reminders</Label>
                    <p className="text-sm text-muted-foreground">Daily reminders about your goals</p>
                  </div>
                  <Switch
                    checked={settings.preferences.dailyGoalReminders}
                    onCheckedChange={(checked) => updateSettings("preferences", "dailyGoalReminders", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">Receive weekly productivity summaries</p>
                  </div>
                  <Switch
                    checked={settings.preferences.weeklyReports}
                    onCheckedChange={(checked) => updateSettings("preferences", "weeklyReports", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Focus & Timer Settings
              </CardTitle>
              <CardDescription>Optimize your focus sessions and breaks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Default Focus Time: {settings.performance.defaultFocusTime} minutes</Label>
                <Slider
                  value={[settings.performance.defaultFocusTime]}
                  onValueChange={([value]) => updateSettings("performance", "defaultFocusTime", value)}
                  max={120}
                  min={5}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <Label>Short Break Time: {settings.performance.breakTime} minutes</Label>
                <Slider
                  value={[settings.performance.breakTime]}
                  onValueChange={([value]) => updateSettings("performance", "breakTime", value)}
                  max={30}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <Label>Long Break Time: {settings.performance.longBreakTime} minutes</Label>
                <Slider
                  value={[settings.performance.longBreakTime]}
                  onValueChange={([value]) => updateSettings("performance", "longBreakTime", value)}
                  max={60}
                  min={5}
                  step={5}
                  className="w-full"
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-start Breaks</Label>
                    <p className="text-sm text-muted-foreground">Automatically start break timers</p>
                  </div>
                  <Switch
                    checked={settings.performance.autoStartBreaks}
                    onCheckedChange={(checked) => updateSettings("performance", "autoStartBreaks", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-start Focus</Label>
                    <p className="text-sm text-muted-foreground">Automatically start focus sessions after breaks</p>
                  </div>
                  <Switch
                    checked={settings.performance.autoStartFocus}
                    onCheckedChange={(checked) => updateSettings("performance", "autoStartFocus", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mobile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Mobile Experience
              </CardTitle>
              <CardDescription>Optimize the app for mobile devices</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Haptic Feedback</Label>
                  <p className="text-sm text-muted-foreground">Vibration feedback for interactions</p>
                </div>
                <Switch
                  checked={settings.mobile.hapticFeedback}
                  onCheckedChange={(checked) => updateSettings("mobile", "hapticFeedback", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Reduced Motion</Label>
                  <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
                </div>
                <Switch
                  checked={settings.mobile.reducedMotion}
                  onCheckedChange={(checked) => updateSettings("mobile", "reducedMotion", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Large Text</Label>
                  <p className="text-sm text-muted-foreground">Increase text size for better readability</p>
                </div>
                <Switch
                  checked={settings.mobile.largeText}
                  onCheckedChange={(checked) => updateSettings("mobile", "largeText", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>High Contrast</Label>
                  <p className="text-sm text-muted-foreground">Enhanced contrast for better visibility</p>
                </div>
                <Switch
                  checked={settings.mobile.highContrast}
                  onCheckedChange={(checked) => updateSettings("mobile", "highContrast", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Management
              </CardTitle>
              <CardDescription>Control your data backup and privacy settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto Backup</Label>
                  <p className="text-sm text-muted-foreground">Automatically backup your data</p>
                </div>
                <Switch
                  checked={settings.data.autoBackup}
                  onCheckedChange={(checked) => updateSettings("data", "autoBackup", checked)}
                />
              </div>

              <div className="space-y-3">
                <Label>Data Retention: {settings.data.dataRetention} days</Label>
                <Slider
                  value={[settings.data.dataRetention]}
                  onValueChange={([value]) => updateSettings("data", "dataRetention", value)}
                  max={365}
                  min={30}
                  step={30}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Export Format</Label>
                <Select
                  value={settings.data.exportFormat}
                  onValueChange={(value: "json" | "csv") => updateSettings("data", "exportFormat", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium">Data Actions</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button variant="outline" className="gap-2 bg-transparent" onClick={exportData}>
                    <Download className="h-4 w-4" />
                    Export Data
                  </Button>
                  <Button variant="outline" className="gap-2 bg-transparent" disabled>
                    <Upload className="h-4 w-4" />
                    Import Data
                  </Button>
                </div>
                <Button variant="destructive" className="w-full gap-2" disabled>
                  <Trash2 className="h-4 w-4" />
                  Delete All Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
