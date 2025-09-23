"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import { TrendingUp, Target, Brain, Zap, Award, Activity, BarChart3, PieChartIcon, LineChartIcon } from "lucide-react"

interface AnalyticsData {
  productivity: number
  focus: number
  wellbeing: number
  consistency: number
}

interface WeeklyData {
  day: string
  productivity: number
  focus: number
  wellbeing: number
}

interface CategoryData {
  name: string
  value: number
  color: string
}

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("week")
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    productivity: 78,
    focus: 85,
    wellbeing: 72,
    consistency: 91,
  })

  const weeklyData: WeeklyData[] = [
    { day: "Mon", productivity: 85, focus: 90, wellbeing: 75 },
    { day: "Tue", productivity: 78, focus: 82, wellbeing: 80 },
    { day: "Wed", productivity: 92, focus: 88, wellbeing: 85 },
    { day: "Thu", productivity: 76, focus: 79, wellbeing: 70 },
    { day: "Fri", productivity: 88, focus: 95, wellbeing: 82 },
    { day: "Sat", productivity: 65, focus: 70, wellbeing: 90 },
    { day: "Sun", productivity: 70, focus: 75, wellbeing: 95 },
  ]

  const categoryData: CategoryData[] = [
    { name: "Deep Work", value: 35, color: "oklch(0.70 0.22 45)" },
    { name: "Meetings", value: 25, color: "oklch(0.67 0.20 60)" },
    { name: "Learning", value: 20, color: "oklch(0.64 0.18 30)" },
    { name: "Admin", value: 15, color: "oklch(0.72 0.17 75)" },
    { name: "Breaks", value: 5, color: "oklch(0.62 0.24 15)" },
  ]

  const streakData = [
    { week: "W1", streak: 5 },
    { week: "W2", streak: 7 },
    { week: "W3", streak: 4 },
    { week: "W4", streak: 6 },
    { week: "W5", streak: 8 },
    { week: "W6", streak: 3 },
    { week: "W7", streak: 9 },
  ]

  const achievements = [
    { title: "Focus Master", description: "Completed 50 focus sessions", icon: Brain, earned: true },
    { title: "Consistency King", description: "7-day streak maintained", icon: Target, earned: true },
    { title: "Wellness Warrior", description: "Daily breathwork for 30 days", icon: Activity, earned: false },
    { title: "Note Ninja", description: "Captured 100 notes", icon: Zap, earned: true },
  ]

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-balance">Analytics Dashboard</h1>
          <p className="text-muted-foreground text-pretty">
            Track your productivity patterns and optimize your performance
          </p>
        </div>
        <div className="flex gap-2">
          {(["week", "month", "year"] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(range)}
              className="capitalize"
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="mobile-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Productivity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.productivity}%</div>
            <Progress value={analytics.productivity} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">+5% from last week</p>
          </CardContent>
        </Card>

        <Card className="mobile-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              Focus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.focus}%</div>
            <Progress value={analytics.focus} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">+12% from last week</p>
          </CardContent>
        </Card>

        <Card className="mobile-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Wellbeing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.wellbeing}%</div>
            <Progress value={analytics.wellbeing} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">-3% from last week</p>
          </CardContent>
        </Card>

        <Card className="mobile-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Consistency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.consistency}%</div>
            <Progress value={analytics.consistency} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">+8% from last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:grid-cols-4">
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <LineChartIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Trends</span>
          </TabsTrigger>
          <TabsTrigger value="breakdown" className="flex items-center gap-2">
            <PieChartIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Breakdown</span>
          </TabsTrigger>
          <TabsTrigger value="streaks" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Streaks</span>
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            <span className="hidden sm:inline">Awards</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Performance Trends</CardTitle>
              <CardDescription>Track your productivity, focus, and wellbeing over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] md:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="productivity"
                      stackId="1"
                      stroke="oklch(0.70 0.22 45)"
                      fill="oklch(0.70 0.22 45)"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="focus"
                      stackId="2"
                      stroke="oklch(0.67 0.20 60)"
                      fill="oklch(0.67 0.20 60)"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="wellbeing"
                      stackId="3"
                      stroke="oklch(0.64 0.18 30)"
                      fill="oklch(0.64 0.18 30)"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breakdown" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Time Allocation Breakdown</CardTitle>
              <CardDescription>How you spend your productive hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] md:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="streaks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Consistency Streaks</CardTitle>
              <CardDescription>Your habit consistency over the past weeks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] md:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={streakData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="streak" fill="oklch(0.70 0.22 45)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {achievements.map((achievement, index) => (
              <Card key={index} className={`mobile-card ${achievement.earned ? "border-primary" : ""}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <achievement.icon
                      className={`h-5 w-5 ${achievement.earned ? "text-primary" : "text-muted-foreground"}`}
                    />
                    {achievement.title}
                    {achievement.earned && (
                      <Badge variant="secondary" className="ml-auto">
                        Earned
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
