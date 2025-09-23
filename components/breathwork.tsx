"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, Wind, ChevronDown, ChevronUp } from "lucide-react"

const breathworkProtocols = {
  box: {
    name: "4-4-4-4 Box Breathing",
    description: "Focus & Reset",
    icon: "⚡",
    phases: [
      { name: "Inhale", duration: 4 },
      { name: "Hold", duration: 4 },
      { name: "Exhale", duration: 4 },
      { name: "Hold", duration: 4 },
    ],
    totalCycles: 6,
    benefits: ["Reduces stress", "Improves focus", "Calms nervous system"],
  },
  coherence: {
    name: "6:6 Coherence Breathing",
    description: "Stress Regulation",
    icon: "🔥",
    phases: [
      { name: "Inhale", duration: 6 },
      { name: "Exhale", duration: 6 },
    ],
    totalCycles: 10,
    benefits: ["Heart rate variability", "Emotional balance", "Stress relief"],
  },
  sleep: {
    name: "4-7-8 Sleep Downshift",
    description: "Evening Protocol",
    icon: "🧘",
    phases: [
      { name: "Inhale", duration: 4 },
      { name: "Hold", duration: 7 },
      { name: "Exhale", duration: 8 },
    ],
    totalCycles: 4,
    benefits: ["Promotes sleep", "Reduces anxiety", "Activates parasympathetic"],
  },
}

export function Breathwork() {
  const [selectedProtocol, setSelectedProtocol] = useState<keyof typeof breathworkProtocols>("box")
  const [isActive, setIsActive] = useState(false)
  const [currentPhase, setCurrentPhase] = useState(0)
  const [currentCycle, setCurrentCycle] = useState(1)
  const [timeLeft, setTimeLeft] = useState(0)
  const [streak, setStreak] = useState(7) // Mock streak data
  const [isMobile, setIsMobile] = useState(false)
  const [showProtocols, setShowProtocols] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const protocol = breathworkProtocols[selectedProtocol]
  const phase = protocol.phases[currentPhase]
  const progress = timeLeft > 0 ? ((phase.duration - timeLeft) / phase.duration) * 100 : 0

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (isActive && timeLeft === 0) {
      // Move to next phase
      if (currentPhase < protocol.phases.length - 1) {
        setCurrentPhase((prev) => prev + 1)
        setTimeLeft(protocol.phases[currentPhase + 1].duration)
      } else {
        // Move to next cycle or finish
        if (currentCycle < protocol.totalCycles) {
          setCurrentCycle((prev) => prev + 1)
          setCurrentPhase(0)
          setTimeLeft(protocol.phases[0].duration)
        } else {
          // Session complete
          setIsActive(false)
          setCurrentPhase(0)
          setCurrentCycle(1)
          setTimeLeft(0)
        }
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, timeLeft, currentPhase, currentCycle, protocol])

  const startSession = () => {
    setIsActive(true)
    setTimeLeft(protocol.phases[0].duration)
    setCurrentPhase(0)
    setCurrentCycle(1)
  }

  const pauseSession = () => {
    setIsActive(false)
  }

  const resetSession = () => {
    setIsActive(false)
    setCurrentPhase(0)
    setCurrentCycle(1)
    setTimeLeft(0)
  }

  const selectProtocol = (protocolKey: keyof typeof breathworkProtocols) => {
    setSelectedProtocol(protocolKey)
    resetSession()
    if (isMobile) setShowProtocols(false)
  }

  if (isMobile) {
    return (
      <div className="space-y-4 px-4 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-balance">Breathwork</h1>
          <p className="text-muted-foreground text-pretty text-sm">
            3-minute scientifically designed breathing sequences
          </p>
        </div>

        {/* Mobile Protocol Selector */}
        <Card>
          <CardHeader className="cursor-pointer" onClick={() => setShowProtocols(!showProtocols)}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{protocol.icon}</span>
                <div>
                  <CardTitle className="text-base">{protocol.name}</CardTitle>
                  <CardDescription className="text-sm">{protocol.description}</CardDescription>
                </div>
              </div>
              {showProtocols ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
          </CardHeader>
          {showProtocols && (
            <CardContent className="pt-0 space-y-3">
              {Object.entries(breathworkProtocols).map(([key, protocolOption]) => (
                <Card
                  key={key}
                  className={`cursor-pointer transition-all ${
                    selectedProtocol === key ? "ring-2 ring-primary bg-accent" : "hover:bg-accent/50"
                  }`}
                  onClick={() => selectProtocol(key as keyof typeof breathworkProtocols)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{protocolOption.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{protocolOption.name}</div>
                        <div className="text-xs text-muted-foreground">{protocolOption.description}</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {protocolOption.benefits.slice(0, 2).map((benefit, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          )}
        </Card>

        {/* Mobile Breathing Interface */}
        <Card>
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Wind className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Daily Streak: {streak} days</span>
            </div>
            <CardDescription>
              Cycle {currentCycle} of {protocol.totalCycles}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Mobile Breathing Circle */}
            <div className="flex justify-center">
              <div className="relative">
                <div
                  className={`w-56 h-56 rounded-full border-4 border-primary/20 flex items-center justify-center transition-all duration-1000 ${
                    isActive && phase.name === "Inhale"
                      ? "scale-110 border-primary bg-primary/10"
                      : isActive && phase.name === "Exhale"
                        ? "scale-90 border-primary/40"
                        : "scale-100"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-xl font-semibold text-primary mb-2">{phase.name}</div>
                    {timeLeft > 0 && <div className="text-4xl font-mono font-bold">{timeLeft}</div>}
                  </div>
                </div>
                {timeLeft > 0 && (
                  <div className="absolute inset-0">
                    <svg className="w-56 h-56 transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-primary"
                        strokeDasharray={`${progress * 2.83} 283`}
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Phase Indicators */}
            <div className="flex justify-center gap-1 flex-wrap">
              {protocol.phases.map((phaseItem, index) => (
                <div
                  key={index}
                  className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                    index === currentPhase ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {phaseItem.name} {phaseItem.duration}s
                </div>
              ))}
            </div>

            {/* Mobile Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Session Progress</span>
                <span>
                  {currentCycle}/{protocol.totalCycles} cycles
                </span>
              </div>
              <Progress value={(currentCycle / protocol.totalCycles) * 100} className="h-2" />
            </div>

            {/* Mobile Controls */}
            <div className="flex justify-center gap-3">
              {!isActive ? (
                <Button onClick={startSession} size="lg" className="gap-2 px-8">
                  <Play className="h-5 w-5" />
                  Start
                </Button>
              ) : (
                <Button onClick={pauseSession} size="lg" variant="secondary" className="gap-2 px-8">
                  <Pause className="h-5 w-5" />
                  Pause
                </Button>
              )}
              <Button onClick={resetSession} size="lg" variant="outline" className="gap-2 bg-transparent">
                <RotateCcw className="h-5 w-5" />
              </Button>
            </div>

            {/* Mobile Instructions */}
            {!isActive && (
              <div className="text-center text-sm text-muted-foreground space-y-1">
                <p>Follow the visual guide and breathe naturally</p>
                <p>Find a comfortable position and relax</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Breathwork Protocols</h1>
        <p className="text-muted-foreground text-pretty">3-minute scientifically designed breathing sequences</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Protocol Selection */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Choose Protocol</h2>
          {Object.entries(breathworkProtocols).map(([key, protocol]) => (
            <Card
              key={key}
              className={`cursor-pointer transition-all ${
                selectedProtocol === key ? "ring-2 ring-primary bg-accent" : "hover:bg-accent/50"
              }`}
              onClick={() => selectProtocol(key as keyof typeof breathworkProtocols)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{protocol.icon}</span>
                  <div>
                    <CardTitle className="text-sm">{protocol.name}</CardTitle>
                    <CardDescription className="text-xs">{protocol.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-1">
                  {protocol.benefits.map((benefit, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Streak Counter */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Wind className="h-4 w-4" />
                Daily Streak
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-primary">{streak} days</div>
              <p className="text-xs text-muted-foreground">Keep it up!</p>
            </CardContent>
          </Card>
        </div>

        {/* Breathing Interface */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <span className="text-xl">{protocol.icon}</span>
                {protocol.name}
              </CardTitle>
              <CardDescription>
                Cycle {currentCycle} of {protocol.totalCycles}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Breathing Circle */}
              <div className="flex justify-center">
                <div className="relative">
                  <div
                    className={`w-48 h-48 rounded-full border-4 border-primary/20 flex items-center justify-center transition-all duration-1000 ${
                      isActive && phase.name === "Inhale"
                        ? "scale-110 border-primary bg-primary/10"
                        : isActive && phase.name === "Exhale"
                          ? "scale-90 border-primary/40"
                          : "scale-100"
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-lg font-semibold text-primary">{phase.name}</div>
                      {timeLeft > 0 && <div className="text-3xl font-mono font-bold">{timeLeft}</div>}
                    </div>
                  </div>
                  {timeLeft > 0 && (
                    <div className="absolute inset-0">
                      <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-primary"
                          strokeDasharray={`${progress * 2.83} 283`}
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Phase Indicators */}
              <div className="flex justify-center gap-2">
                {protocol.phases.map((phaseItem, index) => (
                  <div
                    key={index}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      index === currentPhase ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {phaseItem.name} {phaseItem.duration}s
                  </div>
                ))}
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Session Progress</span>
                  <span>
                    {currentCycle}/{protocol.totalCycles} cycles
                  </span>
                </div>
                <Progress value={(currentCycle / protocol.totalCycles) * 100} />
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-2">
                {!isActive ? (
                  <Button onClick={startSession} size="lg" className="gap-2">
                    <Play className="h-4 w-4" />
                    Start Session
                  </Button>
                ) : (
                  <Button onClick={pauseSession} size="lg" variant="secondary" className="gap-2">
                    <Pause className="h-4 w-4" />
                    Pause
                  </Button>
                )}
                <Button onClick={resetSession} size="lg" variant="outline" className="gap-2 bg-transparent">
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
              </div>

              {/* Instructions */}
              {!isActive && (
                <div className="text-center text-sm text-muted-foreground space-y-1">
                  <p>Follow the visual guide and breathe naturally</p>
                  <p>Find a comfortable position and relax your shoulders</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
