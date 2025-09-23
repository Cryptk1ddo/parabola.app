"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, Volume2, VolumeX, Settings, Trophy, Flame } from "lucide-react"

const presets = {
  "25/5": { work: 25, break: 5 },
  "50/10": { work: 50, break: 10 },
  "90/20": { work: 90, break: 20 },
}

const binauralBeats = {
  focus: "Beta/Gamma - Enhanced Focus",
  calm: "Alpha/Theta - Calm State",
  flow: "Low Beta - Flow State",
}

export function FocusTimer() {
  const [preset, setPreset] = useState("25/5")
  const [isRunning, setIsRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [isBreak, setIsBreak] = useState(false)
  const [binauralEnabled, setBinauralEnabled] = useState(false)
  const [binauralType, setBinauralType] = useState("focus")
  const [sessions, setSessions] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const currentPreset = presets[preset as keyof typeof presets]
  const totalTime = isBreak ? currentPreset.break * 60 : currentPreset.work * 60
  const progress = ((totalTime - timeLeft) / totalTime) * 100

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft])

  useEffect(() => {
    if (timeLeft === 0) {
      setIsRunning(false)
      if (!isBreak) {
        setSessions((prev) => prev + 1)
        setIsBreak(true)
        setTimeLeft(currentPreset.break * 60)
      } else {
        setIsBreak(false)
        setTimeLeft(currentPreset.work * 60)
      }
    }
  }, [timeLeft, isBreak, currentPreset])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleStart = () => setIsRunning(true)
  const handlePause = () => setIsRunning(false)
  const handleReset = () => {
    setIsRunning(false)
    setIsBreak(false)
    setTimeLeft(currentPreset.work * 60)
  }

  const handlePresetChange = (newPreset: string) => {
    setPreset(newPreset)
    const preset = presets[newPreset as keyof typeof presets]
    setTimeLeft(preset.work * 60)
    setIsBreak(false)
    setIsRunning(false)
  }

  if (isMobile) {
    return (
      <div className="space-y-4 px-4 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-balance">Focus Timer</h1>
          <p className="text-muted-foreground text-pretty text-sm">Pomodoro engine with binaural beats</p>
        </div>

        {/* Mobile Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="text-center">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Sessions</span>
              </div>
              <div className="text-xl font-bold text-primary">{sessions}</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">Streak</span>
              </div>
              <div className="text-xl font-bold text-primary">7</div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Timer Display */}
        <Card className="relative overflow-hidden">
          <CardContent className="pt-8 pb-6">
            <div className="text-center space-y-4">
              <div className="space-y-2">
                <Badge variant={isBreak ? "secondary" : "default"} className="text-sm px-3 py-1">
                  {isBreak ? "Break Time" : "Focus Session"}
                </Badge>
                <div className="text-sm text-muted-foreground">
                  Session {sessions + 1} • {preset} intervals
                </div>
              </div>

              {/* Large Mobile Timer */}
              <div className="relative">
                <div className="text-7xl font-mono font-bold text-primary leading-none">{formatTime(timeLeft)}</div>
                <Progress value={progress} className="mt-6 h-2" />
              </div>

              {/* Mobile Controls */}
              <div className="flex justify-center gap-3 pt-4">
                {!isRunning ? (
                  <Button onClick={handleStart} size="lg" className="gap-2 px-8">
                    <Play className="h-5 w-5" />
                    Start
                  </Button>
                ) : (
                  <Button onClick={handlePause} size="lg" variant="secondary" className="gap-2 px-8">
                    <Pause className="h-5 w-5" />
                    Pause
                  </Button>
                )}
                <Button onClick={handleReset} size="lg" variant="outline" className="gap-2 bg-transparent">
                  <RotateCcw className="h-5 w-5" />
                </Button>
                <Button onClick={() => setShowSettings(!showSettings)} size="lg" variant="outline" className="gap-2">
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mobile Settings Panel */}
        {showSettings && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Timer Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Interval Preset</Label>
                <Select value={preset} onValueChange={handlePresetChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="25/5">25/5 - Classic Pomodoro</SelectItem>
                    <SelectItem value="50/10">50/10 - Extended Focus</SelectItem>
                    <SelectItem value="90/20">90/20 - Deep Work</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="binaural">Binaural Beats</Label>
                    {binauralEnabled ? (
                      <Volume2 className="h-4 w-4 text-primary" />
                    ) : (
                      <VolumeX className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <Switch id="binaural" checked={binauralEnabled} onCheckedChange={setBinauralEnabled} />
                </div>

                {binauralEnabled && (
                  <div className="space-y-2">
                    <Label>Beat Type</Label>
                    <Select value={binauralType} onValueChange={setBinauralType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="focus">Focus - Beta/Gamma</SelectItem>
                        <SelectItem value="calm">Calm - Alpha/Theta</SelectItem>
                        <SelectItem value="flow">Flow - Low Beta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Focus Timer</h1>
        <p className="text-muted-foreground text-pretty">Pomodoro engine with binaural beats for enhanced focus</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Timer Display */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{isBreak ? "Break Time" : "Focus Session"}</CardTitle>
            <CardDescription>
              Session {sessions + 1} • {preset} intervals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-mono font-bold text-primary">{formatTime(timeLeft)}</div>
              <Progress value={progress} className="mt-4" />
            </div>

            <div className="flex justify-center gap-2">
              {!isRunning ? (
                <Button onClick={handleStart} size="lg" className="gap-2">
                  <Play className="h-4 w-4" />
                  Start
                </Button>
              ) : (
                <Button onClick={handlePause} size="lg" variant="secondary" className="gap-2">
                  <Pause className="h-4 w-4" />
                  Pause
                </Button>
              )}
              <Button onClick={handleReset} size="lg" variant="outline" className="gap-2 bg-transparent">
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Timer Settings</CardTitle>
            <CardDescription>Customize your focus sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Interval Preset</Label>
              <Select value={preset} onValueChange={handlePresetChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25/5">25/5 - Classic Pomodoro</SelectItem>
                  <SelectItem value="50/10">50/10 - Extended Focus</SelectItem>
                  <SelectItem value="90/20">90/20 - Deep Work</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="binaural">Binaural Beats</Label>
                <Switch id="binaural" checked={binauralEnabled} onCheckedChange={setBinauralEnabled} />
              </div>

              {binauralEnabled && (
                <div className="space-y-2">
                  <Label>Beat Type</Label>
                  <Select value={binauralType} onValueChange={setBinauralType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="focus">Focus - Beta/Gamma</SelectItem>
                      <SelectItem value="calm">Calm - Alpha/Theta</SelectItem>
                      <SelectItem value="flow">Flow - Low Beta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Sessions Completed</span>
                <span className="font-semibold">{sessions}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
