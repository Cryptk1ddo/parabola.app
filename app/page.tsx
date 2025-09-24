"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@clerk/nextjs"
import { Sidebar } from "@/components/sidebar"
import { CommandPalette } from "@/components/command-palette"
import { UserProfile } from "@/components/user-profile"
import { FocusTimer } from "@/components/focus-timer"
import { Breathwork } from "@/components/breathwork"
import { NotesCapture } from "@/components/notes-capture"
import { ProgressDashboard } from "@/components/progress-dashboard"
import { LibraryHub } from "@/components/library-hub"
import { StackCenter } from "@/components/stack-center"
import { HabitTracker } from "@/components/habit-tracker"
import { AICoach } from "@/components/ai-coach"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { Settings } from "@/components/settings"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAudioSystem } from "@/lib/audio"
import {
  Menu,
  Target,
  Wind,
  FileText,
  BarChart3,
  BookOpen,
  Pill,
  CheckCircle,
  Bot,
  Shield,
  SettingsIcon,
  TrendingUp,
  Headphones,
  Volume2,
  VolumeX,
  Loader2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  const { isLoaded, isSignedIn } = useAuth()
  const [activeSection, setActiveSection] = useState("focus")
  const [isMobile, setIsMobile] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const audioSystem = useAudioSystem()

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Show loading screen while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-primary-foreground font-bold text-2xl">P</span>
          </div>
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading Parabola...</p>
        </div>
      </div>
    )
  }

  // Redirect to sign-in if not authenticated
  if (!isSignedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-primary-foreground font-bold text-3xl">P</span>
          </div>
          <h1 className="text-3xl font-bold mb-4">Welcome to Parabola</h1>
          <p className="text-muted-foreground mb-8">
            Your advanced productivity OS for peak performance. Sign in to access your personalized workspace with binaural beats, AI coaching, and comprehensive habit tracking.
          </p>
          <div className="space-y-3">
            <UserProfile />
          </div>
        </div>
      </div>
    )
  }

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const renderContent = () => {
    switch (activeSection) {
      case "focus":
        return <FocusTimer />
      case "breathwork":
        return <Breathwork />
      case "notes":
        return <NotesCapture />
      case "progress":
        return <ProgressDashboard />
      case "library":
        return <LibraryHub />
      case "stack":
        return <StackCenter />
      case "habits":
        return <HabitTracker />
      case "coach":
        return <AICoach />
      case "analytics":
        return <AnalyticsDashboard />
      case "settings":
        return <Settings />
      case "neuro":
        return (
          <div className="space-y-6 px-4 md:px-0">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-balance">Neurotraining Hub</h1>
              <p className="text-muted-foreground text-pretty text-sm md:text-base">
                Cognitive enhancement and brain training
              </p>
            </div>
            <div className="text-center text-muted-foreground py-12">Coming soon - Brain training games</div>
          </div>
        )
      case "firewall":
        return (
          <div className="space-y-6 px-4 md:px-0">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-balance">Distraction Firewall</h1>
              <p className="text-muted-foreground text-pretty text-sm md:text-base">
                Block distractions during focus sessions
              </p>
            </div>
            <div className="text-center text-muted-foreground py-12">Coming soon - Distraction blocking</div>
          </div>
        )
      default:
        return <FocusTimer />
    }
  }

  const primaryNavItems = [
    { id: "focus", label: "Focus", icon: Target, category: "primary" },
    { id: "notes", label: "Notes", icon: FileText, category: "primary" },
    { id: "habits", label: "Habits", icon: CheckCircle, category: "primary" },
    { id: "progress", label: "Progress", icon: BarChart3, category: "primary" },
  ]

  const secondaryNavItems = [
    { id: "breathwork", label: "Breathwork", icon: Wind, category: "wellness" },
    { id: "analytics", label: "Analytics", icon: TrendingUp, category: "insights" },
    { id: "coach", label: "AI Coach", icon: Bot, category: "ai" },
    { id: "library", label: "Library", icon: BookOpen, category: "resources" },
    { id: "stack", label: "Stack", icon: Pill, category: "resources" },
  ]

  const allNavItems = [...primaryNavItems, ...secondaryNavItems]

  const MobileBottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-card/98 backdrop-blur-xl supports-[backdrop-filter]:bg-card/95 border-t border-border/50 z-50 md:hidden shadow-lg">
      <div className="safe-area-inset-bottom">
        <div className="grid grid-cols-5 gap-0.5 p-1">
          {primaryNavItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                className={`flex flex-col gap-1 h-auto py-3 px-2 min-h-[64px] text-xs rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                    : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => {
                  setActiveSection(item.id)
                  setMobileMenuOpen(false)
                }}
              >
                <div className={`p-1.5 rounded-lg transition-colors ${isActive ? "bg-primary/15" : "bg-transparent"}`}>
                  <Icon className={`h-5 w-5 ${isActive ? "text-primary" : ""}`} />
                </div>
                <span className={`font-medium leading-tight ${isActive ? "text-primary" : ""}`}>{item.label}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                )}
              </Button>
            )
          })}

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex flex-col gap-1 h-auto py-3 px-2 min-h-[64px] text-xs rounded-xl hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-all duration-200"
              >
                <div className="p-1.5 rounded-lg bg-transparent">
                  <Menu className="h-5 w-5" />
                </div>
                <span className="font-medium leading-tight">More</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[320px] p-0">
              <MobileMenuContent />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )

  const MobileMenuContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-6 border-b border-border/50 bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-primary-foreground font-bold text-lg">P</span>
        </div>
        <div>
          <h2 className="text-xl font-bold">Parabola</h2>
          <p className="text-sm text-muted-foreground">Productivity Suite</p>
        </div>
      </div>

      {/* Navigation Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Quick Access</h3>
          <div className="grid grid-cols-2 gap-2">
            {primaryNavItems.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "outline"}
                  className="h-16 flex flex-col gap-2 text-xs"
                  onClick={() => {
                    setActiveSection(item.id)
                    setMobileMenuOpen(false)
                  }}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Button>
              )
            })}
          </div>
        </div>

        {/* Secondary Features */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">More Features</h3>
          <div className="space-y-1">
            {secondaryNavItems.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className="w-full justify-start gap-4 h-14 text-left"
                  onClick={() => {
                    setActiveSection(item.id)
                    setMobileMenuOpen(false)
                  }}
                >
                  <div className={`p-2 rounded-lg ${isActive ? "bg-primary-foreground/10" : "bg-accent/50"}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium block">{item.label}</span>
                    <span className="text-xs text-muted-foreground capitalize">{item.category}</span>
                  </div>
                </Button>
              )
            })}
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">System</h3>
          <Button
            variant={activeSection === "settings" ? "default" : "ghost"}
            className="w-full justify-start gap-4 h-14"
            onClick={() => {
              setActiveSection("settings")
              setMobileMenuOpen(false)
            }}
          >
            <div
              className={`p-2 rounded-lg ${activeSection === "settings" ? "bg-primary-foreground/10" : "bg-accent/50"}`}
            >
              <SettingsIcon className="h-5 w-5" />
            </div>
            <div className="flex-1 text-left">
              <span className="font-medium block">Settings</span>
              <span className="text-xs text-muted-foreground">Preferences & config</span>
            </div>
          </Button>
        </div>

        {/* Coming Soon */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Coming Soon</h3>
          <div className="space-y-1 opacity-60">
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
              <div className="p-2 rounded-lg bg-muted">
                <Target className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <span className="font-medium text-sm block">Neurotraining</span>
                <span className="text-xs text-muted-foreground">Brain training games</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                Soon
              </Badge>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
              <div className="p-2 rounded-lg bg-muted">
                <Shield className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <span className="font-medium text-sm block">Firewall</span>
                <span className="text-xs text-muted-foreground">Distraction blocking</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                Soon
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const MobileHeader = () => (
    <div className="sticky top-0 bg-background/98 backdrop-blur-xl supports-[backdrop-filter]:bg-background/95 border-b border-border/50 z-40 md:hidden shadow-sm">
      <div className="safe-area-inset-top">
        <div className="flex items-center justify-between p-4 min-h-[64px]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-primary-foreground font-bold text-sm">P</span>
            </div>
            <div>
              <h1 className="text-lg font-bold">Parabola</h1>
              <p className="text-xs text-muted-foreground capitalize font-medium">
                {allNavItems.find((item) => item.id === activeSection)?.label || activeSection}
              </p>
            </div>
          </div>
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-10 p-0 rounded-xl hover:bg-accent/50 transition-colors"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[320px] p-0">
              <MobileMenuContent />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )

  const DesktopHeader = () => (
    <div className="sticky top-0 bg-background/98 backdrop-blur-xl supports-[backdrop-filter]:bg-background/95 border-b border-border/50 z-40 hidden md:block shadow-sm">
      <div className="flex items-center justify-between p-4 min-h-[64px] max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <CommandPalette activeSection={activeSection} onSectionChange={setActiveSection} />
        </div>
        
        <div className="flex items-center gap-2">
          {/* Audio Controls */}
          <div className="flex items-center gap-1 mr-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => audioSystem.isPlaying ? audioSystem.stopAllAudio() : audioSystem.playBinauralBeats('focus')}
              className="gap-2"
            >
              {audioSystem.isPlaying ? <VolumeX className="h-4 w-4" /> : <Headphones className="h-4 w-4" />}
              <span className="text-xs">
                {audioSystem.isPlaying ? 'Stop Audio' : 'Focus Audio'}
              </span>
            </Button>
          </div>
          
          <ThemeToggle />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveSection("settings")}
            className={activeSection === "settings" ? "bg-accent" : ""}
          >
            <SettingsIcon className="h-4 w-4" />
          </Button>

          {/* User Profile */}
          <UserProfile />
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-background">
      {!isMobile && <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />}

      <main className="flex-1 overflow-auto">
        {!isMobile && <DesktopHeader />}
        {isMobile && <MobileHeader />}

        <div className={`${isMobile ? "pb-28 pt-2" : "p-8"}`}>{renderContent()}</div>
      </main>

      {isMobile && <MobileBottomNav />}
    </div>
  )
}
