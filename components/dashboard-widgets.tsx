"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Target,
  Wind,
  FileText,
  BarChart3,
  CheckCircle,
  Clock,
  Flame,
  TrendingUp,
  Calendar,
  Brain,
  Heart,
  Zap,
  Plus,
  Settings,
  Eye,
  EyeOff,
  GripVertical,
} from "lucide-react"
import { useFocusSessions, useHabits, useNotes, useLocalStorage } from "@/lib/storage"

interface Widget {
  id: string
  type: "focus-stats" | "habit-progress" | "recent-notes" | "quick-actions" | "streak-counter" | "time-tracker" | "wellness-check"
  title: string
  visible: boolean
  order: number
  size: "small" | "medium" | "large"
}

const DEFAULT_WIDGETS: Widget[] = [
  { id: "focus-stats", type: "focus-stats", title: "Focus Statistics", visible: true, order: 0, size: "medium" },
  { id: "habit-progress", type: "habit-progress", title: "Habit Progress", visible: true, order: 1, size: "medium" },
  { id: "recent-notes", type: "recent-notes", title: "Recent Notes", visible: true, order: 2, size: "large" },
  { id: "quick-actions", type: "quick-actions", title: "Quick Actions", visible: true, order: 3, size: "small" },
  { id: "streak-counter", type: "streak-counter", title: "Streak Counter", visible: true, order: 4, size: "small" },
  { id: "time-tracker", type: "time-tracker", title: "Time Tracker", visible: false, order: 5, size: "medium" },
  { id: "wellness-check", type: "wellness-check", title: "Wellness Check", visible: false, order: 6, size: "small" },
]

export function DashboardWidgets() {
  const [widgets, setWidgets] = useLocalStorage("dashboard-widgets", DEFAULT_WIDGETS)
  const [editMode, setEditMode] = useState(false)
  const [focusSessions] = useFocusSessions()
  const [habits] = useHabits()
  const [notes] = useNotes()

  const visibleWidgets = widgets
    .filter(widget => widget.visible)
    .sort((a, b) => a.order - b.order)

  const updateWidget = (id: string, updates: Partial<Widget>) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === id ? { ...widget, ...updates } : widget
    ))
  }

  const FocusStatsWidget = () => {
    const totalSessions = focusSessions.length
    const completedSessions = focusSessions.filter(s => s.completed).length
    const totalFocusTime = focusSessions
      .filter(s => s.completed)
      .reduce((total, session) => total + session.duration, 0)
    
    const hours = Math.floor(totalFocusTime / 3600)
    const minutes = Math.floor((totalFocusTime % 3600) / 60)

    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            Focus Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{completedSessions}</div>
              <div className="text-xs text-muted-foreground">Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {hours}h {minutes}m
              </div>
              <div className="text-xs text-muted-foreground">Focus Time</div>
            </div>
          </div>
          {totalSessions > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Completion Rate</span>
                <span>{Math.round((completedSessions / totalSessions) * 100)}%</span>
              </div>
              <Progress value={(completedSessions / totalSessions) * 100} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const HabitProgressWidget = () => {
    const todayString = new Date().toISOString().split('T')[0]
    const todayHabits = habits.filter(habit => 
      habit.completedDates.includes(todayString)
    )
    const completionRate = habits.length > 0 ? (todayHabits.length / habits.length) * 100 : 0

    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Habit Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Today's Progress</span>
            <Badge variant={completionRate > 50 ? "default" : "secondary"}>
              {todayHabits.length}/{habits.length}
            </Badge>
          </div>
          <Progress value={completionRate} className="h-2" />
          {habits.slice(0, 3).map(habit => (
            <div key={habit.id} className="flex items-center justify-between text-sm">
              <span className={todayHabits.some(h => h.id === habit.id) ? "line-through text-muted-foreground" : ""}>
                {habit.name}
              </span>
              <div className="flex items-center gap-1">
                <Flame className="h-3 w-3 text-orange-500" />
                <span className="text-xs">{habit.streak}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  const RecentNotesWidget = () => {
    const recentNotes = notes
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5)

    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-500" />
            Recent Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentNotes.length > 0 ? (
            <div className="space-y-3">
              {recentNotes.map(note => (
                <div key={note.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{note.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">{note.content}</p>
                    <div className="flex gap-1 mt-1">
                      {note.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground text-sm py-4">
              No notes yet. Start capturing your thoughts!
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const QuickActionsWidget = () => {
    const quickActions = [
      { id: "focus", label: "Start Focus", icon: Target, color: "text-red-500" },
      { id: "breathe", label: "Breathwork", icon: Wind, color: "text-blue-500" },
      { id: "note", label: "Quick Note", icon: FileText, color: "text-green-500" },
      { id: "habit", label: "Check Habit", icon: CheckCircle, color: "text-purple-500" },
    ]

    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map(action => {
              const Icon = action.icon
              return (
                <Button
                  key={action.id}
                  variant="outline"
                  size="sm"
                  className="h-auto p-3 flex flex-col gap-1"
                >
                  <Icon className={`h-4 w-4 ${action.color}`} />
                  <span className="text-xs">{action.label}</span>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>
    )
  }

  const StreakCounterWidget = () => {
    const longestStreak = habits.reduce((max, habit) => Math.max(max, habit.streak), 0)
    const totalHabits = habits.length
    const activeStreaks = habits.filter(h => h.streak > 0).length

    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-500" />
            Streak Counter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500">{longestStreak}</div>
            <div className="text-xs text-muted-foreground">Longest Streak</div>
          </div>
          <div className="flex justify-between text-sm">
            <span>Active Streaks</span>
            <Badge variant="secondary">{activeStreaks}/{totalHabits}</Badge>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderWidget = (widget: Widget) => {
    const baseClasses = "h-fit"
    const sizeClasses = {
      small: "col-span-1",
      medium: "col-span-1 md:col-span-2",
      large: "col-span-1 md:col-span-3"
    }

    const widgetContent = () => {
      switch (widget.type) {
        case "focus-stats":
          return <FocusStatsWidget />
        case "habit-progress":
          return <HabitProgressWidget />
        case "recent-notes":
          return <RecentNotesWidget />
        case "quick-actions":
          return <QuickActionsWidget />
        case "streak-counter":
          return <StreakCounterWidget />
        default:
          return (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{widget.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-muted-foreground text-sm py-4">
                  Widget coming soon...
                </div>
              </CardContent>
            </Card>
          )
      }
    }

    return (
      <div key={widget.id} className={`${baseClasses} ${sizeClasses[widget.size]}`}>
        {widgetContent()}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Your productivity overview</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="h-4 w-4" />
              Customize
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Customize Dashboard</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid gap-4">
                {widgets.map(widget => (
                  <div key={widget.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium text-sm">{widget.title}</div>
                        <div className="text-xs text-muted-foreground capitalize">{widget.type.replace('-', ' ')}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={widget.size}
                        onValueChange={(size: "small" | "medium" | "large") => 
                          updateWidget(widget.id, { size })
                        }
                      >
                        <SelectTrigger className="w-24 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateWidget(widget.id, { visible: !widget.visible })}
                      >
                        {widget.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        {visibleWidgets.map(renderWidget)}
      </div>
    </div>
  )
}