"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Target,
  Wind,
  FileText,
  BarChart3,
  BookOpen,
  Pill,
  CheckCircle,
  Bot,
  Brain,
  Shield,
  Settings,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from "lucide-react"

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

const navigationItems = [
  { id: "focus", label: "Focus Timer", icon: Target },
  { id: "breathwork", label: "Breathwork", icon: Wind },
  { id: "notes", label: "Capture & Notes", icon: FileText },
  { id: "progress", label: "Progress", icon: BarChart3 },
  { id: "analytics", label: "Analytics", icon: TrendingUp },
  { id: "habits", label: "Habit Tracker", icon: CheckCircle },
  { id: "library", label: "Library", icon: BookOpen },
  { id: "stack", label: "Stack Center", icon: Pill },
  { id: "coach", label: "AI Coach", icon: Bot },
]

const comingSoonItems = [
  { id: "neuro", label: "Neurotraining", icon: Brain },
  { id: "firewall", label: "Firewall", icon: Shield },
]

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div
      className={cn(
        "flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">P</span>
            </div>
            <div>
              <span className="font-semibold text-sidebar-foreground">Parabola</span>
              <p className="text-xs text-sidebar-foreground/60">Productivity Suite</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="px-3 py-2">
              <h3 className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider">Core Features</h3>
            </div>
          )}

          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id

            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-10",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isCollapsed && "justify-center px-2",
                )}
                onClick={() => onSectionChange(item.id)}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {!isCollapsed && <span className="text-sm">{item.label}</span>}
              </Button>
            )
          })}

          {!isCollapsed && comingSoonItems.length > 0 && (
            <>
              <div className="px-3 py-2 mt-4">
                <h3 className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider">Coming Soon</h3>
              </div>
              {comingSoonItems.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className="w-full justify-start gap-3 h-10 text-sidebar-foreground/50 cursor-not-allowed"
                    disabled
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{item.label}</span>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      Soon
                    </Badge>
                  </Button>
                )
              })}
            </>
          )}
        </div>
      </nav>

      {/* Settings */}
      <div className="p-2 border-t border-sidebar-border">
        <Button
          variant={activeSection === "settings" ? "default" : "ghost"}
          className={cn(
            "w-full justify-start gap-3 h-10",
            activeSection === "settings"
              ? "bg-sidebar-primary text-sidebar-primary-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-accent",
            isCollapsed && "justify-center px-2",
          )}
          onClick={() => onSectionChange("settings")}
        >
          <Settings className="h-4 w-4 flex-shrink-0" />
          {!isCollapsed && <span className="text-sm">Settings</span>}
        </Button>
      </div>
    </div>
  )
}
