"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Plus,
  Pill,
  Clock,
  TrendingUp,
  CheckCircle,
  Calendar,
  BarChart3,
  Brain,
  Zap,
  Heart,
  Shield,
} from "lucide-react"

interface Supplement {
  id: string
  name: string
  dosage: string
  timing: string[]
  category: "nootropic" | "vitamin" | "mineral" | "herb" | "other"
  purpose: string
  active: boolean
  sideEffects?: string
  effectiveness: number // 1-5 rating
  createdAt: Date
}

interface LogEntry {
  id: string
  date: Date
  supplementId: string
  taken: boolean
  mood: number // 1-5
  energy: number // 1-5
  focus: number // 1-5
  notes?: string
}

const mockSupplements: Supplement[] = [
  {
    id: "1",
    name: "L-Theanine + Caffeine",
    dosage: "200mg + 100mg",
    timing: ["morning"],
    category: "nootropic",
    purpose: "Focus and calm alertness",
    active: true,
    effectiveness: 4,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    name: "Magnesium Glycinate",
    dosage: "400mg",
    timing: ["evening"],
    category: "mineral",
    purpose: "Sleep quality and muscle recovery",
    active: true,
    effectiveness: 5,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "3",
    name: "Omega-3 EPA/DHA",
    dosage: "1000mg",
    timing: ["morning", "evening"],
    category: "other",
    purpose: "Brain health and inflammation",
    active: true,
    effectiveness: 4,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "4",
    name: "Rhodiola Rosea",
    dosage: "300mg",
    timing: ["morning"],
    category: "herb",
    purpose: "Stress adaptation and mental fatigue",
    active: false,
    effectiveness: 3,
    createdAt: new Date("2024-01-01"),
  },
]

const mockLogs: LogEntry[] = [
  {
    id: "1",
    date: new Date(),
    supplementId: "1",
    taken: true,
    mood: 4,
    energy: 4,
    focus: 5,
    notes: "Great focus session, no jitters",
  },
  {
    id: "2",
    date: new Date(),
    supplementId: "2",
    taken: true,
    mood: 4,
    energy: 3,
    focus: 4,
  },
]

const categoryConfig = {
  nootropic: { name: "Nootropics", icon: Brain, color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  vitamin: { name: "Vitamins", icon: Zap, color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
  mineral: { name: "Minerals", icon: Shield, color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  herb: { name: "Herbs", icon: Heart, color: "bg-green-500/10 text-green-500 border-green-500/20" },
  other: { name: "Other", icon: Pill, color: "bg-gray-500/10 text-gray-500 border-gray-500/20" },
}

const timingOptions = [
  "morning",
  "afternoon",
  "evening",
  "before_workout",
  "after_workout",
  "with_food",
  "empty_stomach",
]

export function StackCenter() {
  const [supplements, setSupplements] = useState<Supplement[]>(mockSupplements)
  const [logs, setLogs] = useState<LogEntry[]>(mockLogs)
  const [activeTab, setActiveTab] = useState("stack")
  const [isAddingSupp, setIsAddingSupp] = useState(false)
  const [isLogging, setIsLogging] = useState(false)
  const [newSupplement, setNewSupplement] = useState({
    name: "",
    dosage: "",
    timing: [] as string[],
    category: "nootropic" as const,
    purpose: "",
    sideEffects: "",
  })
  const [dailyLog, setDailyLog] = useState({
    supplementId: "",
    mood: 3,
    energy: 3,
    focus: 3,
    notes: "",
  })

  const activeSupplements = supplements.filter((s) => s.active)
  const todayLogs = logs.filter((log) => {
    const today = new Date()
    return log.date.toDateString() === today.toDateString()
  })

  const handleAddSupplement = () => {
    if (newSupplement.name && newSupplement.dosage) {
      const supplement: Supplement = {
        id: Date.now().toString(),
        ...newSupplement,
        active: true,
        effectiveness: 3,
        createdAt: new Date(),
      }
      setSupplements([...supplements, supplement])
      setNewSupplement({
        name: "",
        dosage: "",
        timing: [],
        category: "nootropic",
        purpose: "",
        sideEffects: "",
      })
      setIsAddingSupp(false)
    }
  }

  const handleLogEntry = () => {
    if (dailyLog.supplementId) {
      const logEntry: LogEntry = {
        id: Date.now().toString(),
        date: new Date(),
        supplementId: dailyLog.supplementId,
        taken: true,
        mood: dailyLog.mood,
        energy: dailyLog.energy,
        focus: dailyLog.focus,
        notes: dailyLog.notes || undefined,
      }
      setLogs([...logs, logEntry])
      setDailyLog({
        supplementId: "",
        mood: 3,
        energy: 3,
        focus: 3,
        notes: "",
      })
      setIsLogging(false)
    }
  }

  const toggleSupplementActive = (id: string) => {
    setSupplements(supplements.map((s) => (s.id === id ? { ...s, active: !s.active } : s)))
  }

  const getEffectivenessColor = (rating: number) => {
    if (rating >= 4) return "text-green-500"
    if (rating >= 3) return "text-yellow-500"
    return "text-red-500"
  }

  const getComplianceRate = () => {
    const totalExpected = activeSupplements.length
    const totalTaken = todayLogs.filter((log) => log.taken).length
    return totalExpected > 0 ? Math.round((totalTaken / totalExpected) * 100) : 0
  }

  const getAverageRatings = () => {
    if (logs.length === 0) return { mood: 0, energy: 0, focus: 0 }
    const recent = logs.slice(-7) // Last 7 entries
    return {
      mood: Math.round(recent.reduce((acc, log) => acc + log.mood, 0) / recent.length),
      energy: Math.round(recent.reduce((acc, log) => acc + log.energy, 0) / recent.length),
      focus: Math.round(recent.reduce((acc, log) => acc + log.focus, 0) / recent.length),
    }
  }

  const averages = getAverageRatings()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Stack Center</h1>
        <p className="text-muted-foreground text-pretty">Track supplements and optimize your performance protocols</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Pill className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Active Stack</span>
            </div>
            <div className="text-2xl font-bold">{activeSupplements.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Today's Compliance</span>
            </div>
            <div className="text-2xl font-bold text-green-500">{getComplianceRate()}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Avg Focus</span>
            </div>
            <div className="text-2xl font-bold text-purple-500">{averages.focus}/5</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Avg Energy</span>
            </div>
            <div className="text-2xl font-bold text-blue-500">{averages.energy}/5</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="stack">My Stack</TabsTrigger>
          <TabsTrigger value="log">Daily Log</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="stack" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Current Supplement Stack</h2>
            <Dialog open={isAddingSupp} onOpenChange={setIsAddingSupp}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Supplement
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Supplement</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        placeholder="e.g., Magnesium"
                        value={newSupplement.name}
                        onChange={(e) => setNewSupplement({ ...newSupplement, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Dosage</Label>
                      <Input
                        placeholder="e.g., 400mg"
                        value={newSupplement.dosage}
                        onChange={(e) => setNewSupplement({ ...newSupplement, dosage: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={newSupplement.category}
                      onValueChange={(value: any) => setNewSupplement({ ...newSupplement, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(categoryConfig).map(([key, config]) => (
                          <SelectItem key={key} value={key}>
                            {config.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Purpose</Label>
                    <Input
                      placeholder="e.g., Better sleep quality"
                      value={newSupplement.purpose}
                      onChange={(e) => setNewSupplement({ ...newSupplement, purpose: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Timing</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {timingOptions.map((timing) => (
                        <div key={timing} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={timing}
                            checked={newSupplement.timing.includes(timing)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewSupplement({
                                  ...newSupplement,
                                  timing: [...newSupplement.timing, timing],
                                })
                              } else {
                                setNewSupplement({
                                  ...newSupplement,
                                  timing: newSupplement.timing.filter((t) => t !== timing),
                                })
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor={timing} className="text-sm capitalize">
                            {timing.replace("_", " ")}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddSupplement} className="flex-1">
                      Add Supplement
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddingSupp(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {supplements.map((supplement) => {
              const categoryInfo = categoryConfig[supplement.category]
              const CategoryIcon = categoryInfo.icon

              return (
                <Card key={supplement.id} className={`${supplement.active ? "" : "opacity-60"}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <CategoryIcon className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <CardTitle className="text-base">{supplement.name}</CardTitle>
                          <CardDescription>{supplement.dosage}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Switch
                          checked={supplement.active}
                          onCheckedChange={() => toggleSupplementActive(supplement.id)}
                          size="sm"
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div>
                        <Badge variant="outline" className={categoryInfo.color}>
                          {categoryInfo.name}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{supplement.purpose}</p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{supplement.timing.join(", ")}</span>
                        </div>
                        <div className={`flex items-center gap-1 ${getEffectivenessColor(supplement.effectiveness)}`}>
                          <TrendingUp className="h-3 w-3" />
                          <span>{supplement.effectiveness}/5</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="log" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Daily Tracking</h2>
            <Dialog open={isLogging} onOpenChange={setIsLogging}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Log Entry
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Log Supplement Effects</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Supplement</Label>
                    <Select
                      value={dailyLog.supplementId}
                      onValueChange={(value) => setDailyLog({ ...dailyLog, supplementId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select supplement" />
                      </SelectTrigger>
                      <SelectContent>
                        {activeSupplements.map((supplement) => (
                          <SelectItem key={supplement.id} value={supplement.id}>
                            {supplement.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Mood (1-5)</Label>
                      <Select
                        value={dailyLog.mood.toString()}
                        onValueChange={(value) => setDailyLog({ ...dailyLog, mood: Number.parseInt(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <SelectItem key={rating} value={rating.toString()}>
                              {rating}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Energy (1-5)</Label>
                      <Select
                        value={dailyLog.energy.toString()}
                        onValueChange={(value) => setDailyLog({ ...dailyLog, energy: Number.parseInt(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <SelectItem key={rating} value={rating.toString()}>
                              {rating}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Focus (1-5)</Label>
                      <Select
                        value={dailyLog.focus.toString()}
                        onValueChange={(value) => setDailyLog({ ...dailyLog, focus: Number.parseInt(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <SelectItem key={rating} value={rating.toString()}>
                              {rating}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Notes (optional)</Label>
                    <Textarea
                      placeholder="Any observations or side effects..."
                      value={dailyLog.notes}
                      onChange={(e) => setDailyLog({ ...dailyLog, notes: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleLogEntry} className="flex-1">
                      Log Entry
                    </Button>
                    <Button variant="outline" onClick={() => setIsLogging(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {todayLogs.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No entries logged today</p>
                  <Button variant="outline" className="mt-4 bg-transparent" onClick={() => setIsLogging(true)}>
                    Log your first entry
                  </Button>
                </CardContent>
              </Card>
            ) : (
              todayLogs.map((log) => {
                const supplement = supplements.find((s) => s.id === log.supplementId)
                return (
                  <Card key={log.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{supplement?.name}</h3>
                          <p className="text-sm text-muted-foreground">{supplement?.dosage}</p>
                        </div>
                        <Badge variant={log.taken ? "default" : "secondary"}>{log.taken ? "Taken" : "Missed"}</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="text-center">
                          <div className="text-lg font-semibold">{log.mood}/5</div>
                          <div className="text-xs text-muted-foreground">Mood</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold">{log.energy}/5</div>
                          <div className="text-xs text-muted-foreground">Energy</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold">{log.focus}/5</div>
                          <div className="text-xs text-muted-foreground">Focus</div>
                        </div>
                      </div>
                      {log.notes && <div className="mt-3 p-2 bg-muted rounded text-sm">{log.notes}</div>}
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <h2 className="text-xl font-semibold">Performance Analysis</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Recent Averages
                </CardTitle>
                <CardDescription>Based on last 7 entries</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Mood</span>
                  <span className="font-semibold">{averages.mood}/5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Energy</span>
                  <span className="font-semibold">{averages.energy}/5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Focus</span>
                  <span className="font-semibold">{averages.focus}/5</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Insights</CardTitle>
                <CardDescription>Pattern analysis coming soon</CardDescription>
              </CardHeader>
              <CardContent className="text-center py-8">
                <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  AI will analyze your supplement patterns and suggest optimizations
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
