"use client"

import { useState, useEffect, useCallback } from "react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Target,
  Wind,
  FileText,
  BarChart3,
  BookOpen,
  Pill,
  CheckCircle,
  Bot,
  SettingsIcon,
  TrendingUp,
  Search,
  Moon,
  Sun,
  Monitor,
  Zap,
  Clock,
  Brain,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Command,
} from "lucide-react"
import { useTheme } from "next-themes"

interface CommandPaletteProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export function CommandPalette({ activeSection, onSectionChange }: CommandPaletteProps) {
  const [open, setOpen] = useState(false)
  const { setTheme, theme } = useTheme()

  const sections = [
    { id: "focus", label: "Focus Timer", icon: Target, shortcut: "F" },
    { id: "breathwork", label: "Breathwork", icon: Wind, shortcut: "B" },
    { id: "notes", label: "Notes Capture", icon: FileText, shortcut: "N" },
    { id: "progress", label: "Progress Dashboard", icon: BarChart3, shortcut: "P" },
    { id: "library", label: "Library Hub", icon: BookOpen, shortcut: "L" },
    { id: "stack", label: "Stack Center", icon: Pill, shortcut: "S" },
    { id: "habits", label: "Habit Tracker", icon: CheckCircle, shortcut: "H" },
    { id: "ai-coach", label: "AI Coach", icon: Bot, shortcut: "A" },
    { id: "analytics", label: "Analytics", icon: TrendingUp, shortcut: "Y" },
    { id: "settings", label: "Settings", icon: SettingsIcon, shortcut: "," },
  ]

  const quickActions = [
    { 
      id: "start-focus", 
      label: "Start Focus Session", 
      icon: Play, 
      action: () => onSectionChange("focus"),
      category: "Actions"
    },
    { 
      id: "new-note", 
      label: "Create New Note", 
      icon: Plus, 
      action: () => onSectionChange("notes"),
      category: "Actions"
    },
    { 
      id: "start-breathwork", 
      label: "Start Breathwork Session", 
      icon: Wind, 
      action: () => onSectionChange("breathwork"),
      category: "Actions"
    },
    { 
      id: "check-analytics", 
      label: "View Analytics", 
      icon: TrendingUp, 
      action: () => onSectionChange("analytics"),
      category: "Actions"
    },
  ]

  const themeActions = [
    { 
      id: "theme-light", 
      label: "Switch to Light Mode", 
      icon: Sun, 
      action: () => setTheme("light"),
      category: "Theme"
    },
    { 
      id: "theme-dark", 
      label: "Switch to Dark Mode", 
      icon: Moon, 
      action: () => setTheme("dark"),
      category: "Theme"
    },
    { 
      id: "theme-system", 
      label: "Use System Theme", 
      icon: Monitor, 
      action: () => setTheme("system"),
      category: "Theme"
    },
  ]

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  // Keyboard shortcuts for sections
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.altKey) {
        const section = sections.find(s => s.shortcut.toLowerCase() === e.key.toLowerCase())
        if (section) {
          e.preventDefault()
          onSectionChange(section.id)
          setOpen(false)
        }
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [onSectionChange, sections])

  const runCommand = useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      <Button
        variant="outline"
        className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Search commands...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          <CommandGroup heading="Navigation">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <CommandItem
                  key={section.id}
                  onSelect={() => runCommand(() => onSectionChange(section.id))}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  <span>{section.label}</span>
                  {activeSection === section.id && (
                    <Badge variant="secondary" className="ml-auto">Active</Badge>
                  )}
                  <kbd className="ml-auto text-xs opacity-50">Alt+{section.shortcut}</kbd>
                </CommandItem>
              )
            })}
          </CommandGroup>
          
          <CommandSeparator />
          
          <CommandGroup heading="Quick Actions">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <CommandItem
                  key={action.id}
                  onSelect={() => runCommand(action.action)}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  <span>{action.label}</span>
                </CommandItem>
              )
            })}
          </CommandGroup>

          <CommandSeparator />
          
          <CommandGroup heading="Theme">
            {themeActions.map((action) => {
              const Icon = action.icon
              const isActive = theme === action.id.replace('theme-', '')
              return (
                <CommandItem
                  key={action.id}
                  onSelect={() => runCommand(action.action)}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  <span>{action.label}</span>
                  {isActive && (
                    <Badge variant="secondary" className="ml-auto">Active</Badge>
                  )}
                </CommandItem>
              )
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}