"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Target, Zap, Brain, Wind, Timer, TrendingUp, Award, Flame, Star, Trophy } from "lucide-react"

const weeklyData = [
  { day: "Mon", focus: 85, energy: 78, mood: 82, deepWork: 4.5, sessions: 6, breaks: 3 },
  { day: "Tue", focus: 92, energy: 85, mood: 88, deepWork: 5.2, sessions: 8, breaks: 4 },
  { day: "Wed", focus: 78, energy: 72, mood: 75, deepWork: 3.8, sessions: 5, breaks: 2 },
  { day: "Thu", focus: 88, energy: 82, mood: 85, deepWork: 4.8, sessions: 7, breaks: 3 },
  { day: "Fri", focus: 95, energy: 90, mood: 92, deepWork: 6.1, sessions: 9, breaks: 5 },
  { day: "Sat", focus: 70, energy: 68, mood: 72, deepWork: 2.5, sessions: 3, breaks: 1 },
  { day: "Sun", focus: 75, energy: 75, mood: 78, deepWork: 3.2, sessions: 4, breaks: 2 },
]

const monthlyTrends = [
  { week: "Week 1", momentum: 72, discipline: 68, clarity: 75, consistency: 65 },
  { week: "Week 2", momentum: 78, discipline: 75, clarity: 80, consistency: 72 },
  { week: "Week 3", momentum: 85, discipline: 82, clarity: 88, consistency: 85 },
  { week: "Week 4", momentum: 92, discipline: 88, clarity: 90, consistency: 90 },
]

const habitData = [
  { name: "Morning Routine", value: 85, color: "#8b5cf6" },
  { name: "Exercise", value: 70, color: "#06b6d4" },
  { name: "Meditation", value: 90, color: "#10b981" },
  { name: "Reading", value: 65, color: "#f59e0b" },
  { name: "Sleep Schedule", value: 80, color: "#ef4444" },
]

const achievements = [
  {
    id: 1,
    title: "Focus Master",
    description: "Complete 50 Pomodoro sessions",
    icon: Timer,
    earned: true,
    progress: 50,
    target: 50,
  },
  {
    id: 2,
    title: "Breath Warrior",
    description: "7-day breathwork streak",
    icon: Wind,
    earned: true,
    progress: 7,
    target: 7,
  },
  {
    id: 3,
    title: "Deep Thinker",
    description: "10 hours of deep work this week",
    icon: Brain,
    earned: false,
    progress: 8.2,
    target: 10,
  },
  {
    id: 4,
    title: "Momentum Builder",
    description: "30-day consistency streak",
    icon: TrendingUp,
    earned: false,
    progress: 18,
    target: 30,
  },
  {
    id: 5,
    title: "Note Ninja",
    description: "Capture 100 insights",
    icon: Star,
    earned: false,
    progress: 67,
    target: 100,
  },
  {
    id: 6,
    title: "Stack Optimizer",
    description: "Track supplements for 14 days",
    icon: Trophy,
    earned: false,
    progress: 9,
    target: 14,
  },
]

export function ProgressDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("week")
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Calculate current stats
  const currentWeekAvg = {
    focus: Math.round(weeklyData.reduce((acc, day) => acc + day.focus, 0) / weeklyData.length),
    energy: Math.round(weeklyData.reduce((acc, day) => acc + day.energy, 0) / weeklyData.length),
    mood: Math.round(weeklyData.reduce((acc, day) => acc + day.mood, 0) / weeklyData.length),
    deepWork: weeklyData.reduce((acc, day) => acc + day.deepWork, 0),
    totalSessions: weeklyData.reduce((acc, day) => acc + day.sessions, 0),
  }

  const streaks = {
    focus: 12,
    breathwork: 7,
    notes: 5,
    overall: 18,
  }

  const dopamineScore = 78

  const MobileMetricCard = ({ icon: Icon, label, value, color, suffix = "" }) => (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${color}`} />
          <span className="text-sm font-medium">{label}</span>
        </div>
        <div className={`text-lg font-bold ${color}`}>
          {value}
          {suffix}
        </div>
      </div>
      <Progress value={typeof value === "number" ? value : 0} className="mt-2 h-1" />
    </Card>
  )

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="px-4 md:px-0">
        <h1 className="text-2xl md:text-3xl font-bold text-balance">Progress Dashboard</h1>
        <p className="text-muted-foreground text-pretty text-sm md:text-base">
          Track your momentum, clarity, and self-mastery metrics
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <div className="px-4 md:px-0">
          <TabsList className="grid w-full grid-cols-3 md:w-auto md:grid-cols-4">
            <TabsTrigger value="overview" className="text-xs md:text-sm">
              Overview
            </TabsTrigger>
            <TabsTrigger value="trends" className="text-xs md:text-sm">
              Trends
            </TabsTrigger>
            <TabsTrigger value="habits" className="text-xs md:text-sm">
              Habits
            </TabsTrigger>
            <TabsTrigger value="achievements" className="hidden md:block text-xs md:text-sm">
              Achievements
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-4 md:space-y-6">
          <div className="px-4 md:px-0">
            {isMobile ? (
              <div className="grid grid-cols-2 gap-3">
                <MobileMetricCard icon={Target} label="Focus" value={currentWeekAvg.focus} color="text-primary" />
                <MobileMetricCard icon={Zap} label="Energy" value={currentWeekAvg.energy} color="text-yellow-500" />
                <MobileMetricCard icon={Brain} label="Clarity" value={currentWeekAvg.mood} color="text-green-500" />
                <MobileMetricCard
                  icon={Timer}
                  label="Deep Work"
                  value={currentWeekAvg.deepWork.toFixed(1)}
                  color="text-blue-500"
                  suffix="h"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Focus Score</span>
                    </div>
                    <div className="text-2xl font-bold text-primary">{currentWeekAvg.focus}</div>
                    <Progress value={currentWeekAvg.focus} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">Energy Level</span>
                    </div>
                    <div className="text-2xl font-bold text-yellow-500">{currentWeekAvg.energy}</div>
                    <Progress value={currentWeekAvg.energy} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Mental Clarity</span>
                    </div>
                    <div className="text-2xl font-bold text-green-500">{currentWeekAvg.mood}</div>
                    <Progress value={currentWeekAvg.mood} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Timer className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">Deep Work</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-500">{currentWeekAvg.deepWork.toFixed(1)}h</div>
                    <p className="text-xs text-muted-foreground mt-1">This week</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4 md:space-y-6 px-4 md:px-0">
              {/* Weekly Performance Chart */}
              <Card>
                <CardHeader className="pb-2 md:pb-6">
                  <CardTitle className="text-lg md:text-xl">Weekly Performance</CardTitle>
                  <CardDescription className="text-sm">Focus, energy, and mood trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      focus: { label: "Focus", color: "hsl(var(--primary))" },
                      energy: { label: "Energy", color: "hsl(45, 93%, 58%)" },
                      mood: { label: "Mood", color: "hsl(142, 71%, 45%)" },
                    }}
                    className="h-[200px] md:h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" fontSize={12} />
                        <YAxis domain={[0, 100]} fontSize={12} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="focus" stroke="hsl(var(--primary))" strokeWidth={2} />
                        <Line type="monotone" dataKey="energy" stroke="hsl(45, 93%, 58%)" strokeWidth={2} />
                        <Line type="monotone" dataKey="mood" stroke="hsl(142, 71%, 45%)" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2 md:pb-6">
                  <CardTitle className="text-lg md:text-xl">Focus Sessions</CardTitle>
                  <CardDescription className="text-sm">Daily Pomodoro sessions completed</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      sessions: { label: "Sessions", color: "hsl(var(--primary))" },
                    }}
                    className="h-[150px] md:h-[200px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" fontSize={12} />
                        <YAxis fontSize={12} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="sessions" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Streaks & Quick Stats */}
            <div className="space-y-4 md:space-y-6 px-4 md:px-0">
              <Card>
                <CardHeader className="pb-2 md:pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Flame className="h-4 w-4 text-orange-500" />
                    Current Streaks
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Timer className="h-4 w-4 text-primary" />
                      <span className="text-sm">Focus Sessions</span>
                    </div>
                    <Badge variant="secondary">{streaks.focus} days</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wind className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Breathwork</span>
                    </div>
                    <Badge variant="secondary">{streaks.breathwork} days</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Notes Capture</span>
                    </div>
                    <Badge variant="secondary">{streaks.notes} days</Badge>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Overall Streak</span>
                      <Badge className="bg-primary">{streaks.overall} days</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2 md:pb-4">
                  <CardTitle className="text-lg">Dopamine Health</CardTitle>
                  <CardDescription className="text-sm">Lifestyle optimization score</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-primary mb-2">{dopamineScore}</div>
                    <Progress value={dopamineScore} className="mb-2" />
                    <div className="text-sm text-muted-foreground">
                      {dopamineScore >= 80 ? "Excellent" : dopamineScore >= 60 ? "Good" : "Needs Improvement"}
                    </div>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>Sleep Quality</span>
                      <span className="text-green-500">85%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Exercise</span>
                      <span className="text-yellow-500">70%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Screen Time</span>
                      <span className="text-orange-500">60%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4 md:space-y-6 px-4 md:px-0">
          {/* Monthly Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Monthly Self-Mastery Trends</CardTitle>
              <CardDescription>Momentum, discipline, and clarity over the past month</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  momentum: { label: "Momentum", color: "hsl(var(--primary))" },
                  discipline: { label: "Discipline", color: "hsl(45, 93%, 58%)" },
                  clarity: { label: "Clarity", color: "hsl(142, 71%, 45%)" },
                  consistency: { label: "Consistency", color: "hsl(280, 100%, 70%)" },
                }}
                className="h-[250px] md:h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" fontSize={12} />
                    <YAxis domain={[0, 100]} fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="momentum"
                      stackId="1"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.3}
                    />
                    <Area
                      type="monotone"
                      dataKey="discipline"
                      stackId="2"
                      stroke="hsl(45, 93%, 58%)"
                      fill="hsl(45, 93%, 58%)"
                      fillOpacity={0.3}
                    />
                    <Area
                      type="monotone"
                      dataKey="clarity"
                      stackId="3"
                      stroke="hsl(142, 71%, 45%)"
                      fill="hsl(142, 71%, 45%)"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="habits" className="space-y-4 md:space-y-6 px-4 md:px-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Habit Consistency</CardTitle>
              <CardDescription>Track your daily habits and routines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <ChartContainer
                    config={{
                      value: { label: "Consistency", color: "hsl(var(--primary))" },
                    }}
                    className="h-[200px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={habitData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {habitData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
                <div className="space-y-3">
                  {habitData.map((habit, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: habit.color }} />
                        <span className="text-sm">{habit.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={habit.value} className="w-16 h-2" />
                        <span className="text-sm font-medium w-8">{habit.value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4 md:space-y-6 px-4 md:px-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <Award className="h-5 w-5" />
                Achievements & Goals
              </CardTitle>
              <CardDescription>Track your progress towards mastery milestones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {achievements.map((achievement) => {
                const Icon = achievement.icon
                const progressPercent = (achievement.progress / achievement.target) * 100
                return (
                  <div
                    key={achievement.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                      achievement.earned ? "bg-primary/10 border-primary/20" : "bg-muted/50 hover:bg-muted/70"
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${achievement.earned ? "text-primary" : "text-muted-foreground"}`} />
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium ${achievement.earned ? "" : "text-muted-foreground"}`}>
                        {achievement.title}
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">{achievement.description}</div>
                      <div className="flex items-center gap-2">
                        <Progress value={progressPercent} className="flex-1 h-1.5" />
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {achievement.progress}/{achievement.target}
                        </span>
                      </div>
                    </div>
                    {achievement.earned && (
                      <Badge variant="secondary" className="text-xs">
                        Earned
                      </Badge>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
