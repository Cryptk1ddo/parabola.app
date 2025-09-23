"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Target,
  CheckCircle,
  Flame,
  Award,
  BarChart3,
  Zap,
  Brain,
  Heart,
  Droplets,
  Moon,
  Book,
  Dumbbell,
} from "lucide-react"

interface Habit {
  id: string
  name: string
  description: string
  category: "health" | "productivity" | "mindfulness" | "learning" | "fitness"
  frequency: "daily" | "weekly" | "custom"
  targetCount: number
  currentStreak: number
  longestStreak: number
  completedToday: boolean
  completedDates: string[]
  createdAt: Date
  color: string
}

const habitCategories = {
  health: { name: "Health", icon: Heart, color: "text-red-500" },
  productivity: { name: "Productivity", icon: Zap, color: "text-yellow-500" },
  mindfulness: { name: "Mindfulness", icon: Brain, color: "text-purple-500" },
  learning: { name: "Learning", icon: Book, color: "text-blue-500" },
  fitness: { name: "Fitness", icon: Dumbbell, color: "text-green-500" },
}

const habitTemplates = [
  { name: "Drink 8 glasses of water", category: "health", icon: Droplets },
  { name: "Meditate for 10 minutes", category: "mindfulness", icon: Brain },
  { name: "Read for 30 minutes", category: "learning", icon: Book },
  { name: "Exercise for 30 minutes", category: "fitness", icon: Dumbbell },
  { name: "Sleep 8 hours", category: "health", icon: Moon },
  { name: "Complete daily focus session", category: "productivity", icon: Target },
]

const mockHabits: Habit[] = [
  {
    id: "1",
    name: "Morning Meditation",
    description: "10 minutes of mindfulness meditation",
    category: "mindfulness",
    frequency: "daily",
    targetCount: 1,
    currentStreak: 5,
    longestStreak: 12,
    completedToday: true,
    completedDates: ["2024-01-15", "2024-01-14", "2024-01-13"],
    createdAt: new Date("2024-01-10"),
    color: "bg-purple-500",
  },
  {
    id: "2",
    name: "Daily Reading",
    description: "Read for at least 30 minutes",
    category: "learning",
    frequency: "daily",
    targetCount: 1,
    currentStreak: 3,
    longestStreak: 8,
    completedToday: false,
    completedDates: ["2024-01-14", "2024-01-13", "2024-01-12"],
    createdAt: new Date("2024-01-08"),
    color: "bg-blue-500",
  },
]

export function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>(mockHabits)
  const [isAddingHabit, setIsAddingHabit] = useState(false)
  const [activeTab, setActiveTab] = useState("today")
  const [newHabit, setNewHabit] = useState({
    name: "",
    description: "",
    category: "productivity" as const,
    frequency: "daily" as const,
    targetCount: 1,
  })

  const toggleHabitCompletion = (habitId: string) => {
    const today = new Date().toISOString().split("T")[0]
    setHabits(
      habits.map((habit) => {
        if (habit.id === habitId) {
          const wasCompleted = habit.completedToday
          const newCompletedDates = wasCompleted
            ? habit.completedDates.filter((date) => date !== today)
            : [...habit.completedDates, today]

          // Calculate new streak
          let newStreak = 0
          if (!wasCompleted) {
            newStreak = habit.currentStreak + 1
          } else {
            newStreak = Math.max(0, habit.currentStreak - 1)
          }

          return {
            ...habit,
            completedToday: !wasCompleted,
            completedDates: newCompletedDates,
            currentStreak: newStreak,
            longestStreak: Math.max(habit.longestStreak, newStreak),
          }
        }
        return habit
      }),
    )
  }

  const addHabit = () => {
    if (newHabit.name.trim()) {
      const habit: Habit = {
        id: Date.now().toString(),
        ...newHabit,
        currentStreak: 0,
        longestStreak: 0,
        completedToday: false,
        completedDates: [],
        createdAt: new Date(),
        color: `bg-${habitCategories[newHabit.category].color.split("-")[1]}-500`,
      }
      setHabits([...habits, habit])
      setNewHabit({
        name: "",
        description: "",
        category: "productivity",
        frequency: "daily",
        targetCount: 1,
      })
      setIsAddingHabit(false)
    }
  }

  const getCompletionRate = () => {
    const completed = habits.filter((h) => h.completedToday).length
    const total = habits.length
    return total > 0 ? Math.round((completed / total) * 100) : 0
  }

  const getTotalStreak = () => {
    return habits.reduce((sum, habit) => sum + habit.currentStreak, 0)
  }

  const getWeeklyProgress = () => {
    const today = new Date()
    const weekDays = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      weekDays.push(date.toISOString().split("T")[0])
    }

    return weekDays.map((date) => {
      const completedCount = habits.filter((habit) => habit.completedDates.includes(date)).length
      return {
        date,
        completed: completedCount,
        total: habits.length,
        percentage: habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0,
      }
    })
  }

  const weeklyData = getWeeklyProgress()

  return (
    <div className="space-y-6 px-4 md:px-0">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-balance">Habit Tracker</h1>
        <p className="text-muted-foreground text-pretty text-sm md:text-base">
          Build consistency and track your daily progress
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Today's Progress</span>
            </div>
            <div className="text-2xl font-bold">{getCompletionRate()}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Total Streaks</span>
            </div>
            <div className="text-2xl font-bold text-orange-500">{getTotalStreak()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Active Habits</span>
            </div>
            <div className="text-2xl font-bold text-green-500">{habits.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Best Streak</span>
            </div>
            <div className="text-2xl font-bold text-yellow-500">
              {Math.max(...habits.map((h) => h.longestStreak), 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-semibold">Today's Habits</h2>
            <Dialog open={isAddingHabit} onOpenChange={setIsAddingHabit}>
              <DialogTrigger asChild>
                <Button className="gap-2 w-full sm:w-auto">
                  <Plus className="h-4 w-4" />
                  Add Habit
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Habit</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Habit Name</Label>
                    <Input
                      placeholder="e.g., Morning meditation"
                      value={newHabit.name}
                      onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      placeholder="Brief description..."
                      value={newHabit.description}
                      onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={newHabit.category}
                      onValueChange={(value: any) => setNewHabit({ ...newHabit, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(habitCategories).map(([key, config]) => (
                          <SelectItem key={key} value={key}>
                            {config.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Quick Templates</Label>
                    <div className="grid grid-cols-1 gap-2">
                      {habitTemplates.map((template, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="justify-start gap-2 h-auto py-2 bg-transparent"
                          onClick={() =>
                            setNewHabit({
                              ...newHabit,
                              name: template.name,
                              category: template.category as any,
                            })
                          }
                        >
                          <template.icon className="h-4 w-4" />
                          <span className="text-sm">{template.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addHabit} className="flex-1">
                      Add Habit
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddingHabit(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-3">
            {habits.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No habits yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">Start building better habits today</p>
                  <Button onClick={() => setIsAddingHabit(true)}>Add Your First Habit</Button>
                </CardContent>
              </Card>
            ) : (
              habits.map((habit) => {
                const categoryConfig = habitCategories[habit.category]
                const CategoryIcon = categoryConfig.icon

                return (
                  <Card key={habit.id} className="group hover:shadow-md transition-all">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`w-3 h-3 rounded-full ${habit.color}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <CategoryIcon className={`h-4 w-4 ${categoryConfig.color}`} />
                              <h3 className="font-semibold truncate">{habit.name}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">{habit.description}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-1">
                                <Flame className="h-3 w-3 text-orange-500" />
                                <span className="text-xs text-muted-foreground">{habit.currentStreak} day streak</span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {categoryConfig.name}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant={habit.completedToday ? "default" : "outline"}
                          size="sm"
                          className={`ml-4 ${habit.completedToday ? "bg-green-500 hover:bg-green-600" : ""}`}
                          onClick={() => toggleHabitCompletion(habit.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <h2 className="text-xl font-semibold">Weekly Progress</h2>
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  7-Day Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {weeklyData.map((day, index) => (
                    <div key={day.date} className="flex items-center gap-3">
                      <div className="w-16 text-sm text-muted-foreground">
                        {new Date(day.date).toLocaleDateString("en", { weekday: "short" })}
                      </div>
                      <div className="flex-1">
                        <Progress value={day.percentage} className="h-2" />
                      </div>
                      <div className="w-12 text-sm font-medium text-right">{day.percentage}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              {habits.map((habit) => {
                const categoryConfig = habitCategories[habit.category]
                const CategoryIcon = categoryConfig.icon

                return (
                  <Card key={habit.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <CategoryIcon className={`h-4 w-4 ${categoryConfig.color}`} />
                        <CardTitle className="text-base">{habit.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-orange-500">{habit.currentStreak}</div>
                          <div className="text-xs text-muted-foreground">Current Streak</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-yellow-500">{habit.longestStreak}</div>
                          <div className="text-xs text-muted-foreground">Best Streak</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <h2 className="text-xl font-semibold">Habit Insights</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Consistency Score</CardTitle>
                <CardDescription>Based on last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{getCompletionRate()}%</div>
                <Progress value={getCompletionRate()} className="mb-2" />
                <p className="text-sm text-muted-foreground">
                  {getCompletionRate() >= 80
                    ? "Excellent consistency! Keep it up!"
                    : getCompletionRate() >= 60
                      ? "Good progress, aim for 80%+"
                      : "Focus on building consistency"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
                <CardDescription>Your habit distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(habitCategories).map(([key, config]) => {
                    const count = habits.filter((h) => h.category === key).length
                    const percentage = habits.length > 0 ? Math.round((count / habits.length) * 100) : 0
                    const CategoryIcon = config.icon

                    return (
                      <div key={key} className="flex items-center gap-3">
                        <CategoryIcon className={`h-4 w-4 ${config.color}`} />
                        <div className="flex-1">
                          <div className="flex justify-between text-sm">
                            <span>{config.name}</span>
                            <span>{count} habits</span>
                          </div>
                          <Progress value={percentage} className="h-1 mt-1" />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
