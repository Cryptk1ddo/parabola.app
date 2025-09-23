"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  BookOpen,
  Play,
  CheckCircle,
  Star,
  Clock,
  Zap,
  Brain,
  Snowflake,
  Moon,
  Utensils,
  Shield,
  Heart,
  Bot,
} from "lucide-react"

interface Protocol {
  id: string
  title: string
  category: "dopamine" | "sleep" | "focus" | "nutrition" | "cold" | "nootropics"
  description: string
  duration: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  completed: boolean
  favorite: boolean
  content: {
    overview: string
    steps: string[]
    tips: string[]
    science: string
  }
}

const protocolCategories = {
  dopamine: { name: "Dopamine Mastery", icon: Zap, color: "text-yellow-500" },
  sleep: { name: "Sleep Optimization", icon: Moon, color: "text-blue-500" },
  focus: { name: "Focus Enhancement", icon: Brain, color: "text-purple-500" },
  nutrition: { name: "Focus Nutrition", icon: Utensils, color: "text-green-500" },
  cold: { name: "Cold Exposure", icon: Snowflake, color: "text-cyan-500" },
  nootropics: { name: "Nootropic Cycles", icon: Shield, color: "text-red-500" },
}

const mockProtocols: Protocol[] = [
  {
    id: "1",
    title: "Dopamine Detox Protocol",
    category: "dopamine",
    description: "Reset your reward system for enhanced motivation and focus",
    duration: "7 days",
    difficulty: "Intermediate",
    completed: true,
    favorite: true,
    content: {
      overview:
        "A structured approach to resetting your dopamine sensitivity by temporarily removing high-stimulation activities and focusing on natural reward systems.",
      steps: [
        "Remove social media, gaming, and entertainment for 24-48 hours",
        "Focus on basic activities: walking, reading, meditation",
        "Gradually reintroduce activities with mindful consumption",
        "Establish new reward patterns based on achievement",
      ],
      tips: [
        "Start with shorter periods if you're new to detoxing",
        "Plan engaging but low-stimulation activities",
        "Track your mood and energy levels throughout",
      ],
      science:
        "Dopamine detoxing helps restore baseline dopamine levels, improving motivation and reducing dependency on external stimulation for happiness.",
    },
  },
  {
    id: "2",
    title: "Sleep Architecture Optimization",
    category: "sleep",
    description: "Optimize your sleep cycles for maximum recovery and cognitive performance",
    duration: "21 days",
    difficulty: "Beginner",
    completed: false,
    favorite: false,
    content: {
      overview:
        "A comprehensive approach to improving sleep quality through environment optimization, timing, and pre-sleep routines.",
      steps: [
        "Set consistent sleep and wake times",
        "Create optimal sleep environment (cool, dark, quiet)",
        "Implement 90-minute wind-down routine",
        "Track sleep metrics and adjust accordingly",
      ],
      tips: [
        "Use blackout curtains or eye mask",
        "Keep bedroom temperature between 65-68°F",
        "Avoid screens 2 hours before bed",
      ],
      science:
        "Proper sleep architecture ensures adequate deep sleep and REM cycles, crucial for memory consolidation and cognitive performance.",
    },
  },
  {
    id: "3",
    title: "Flow State Induction",
    category: "focus",
    description: "Systematic approach to entering and maintaining flow states",
    duration: "30 minutes",
    difficulty: "Advanced",
    completed: false,
    favorite: true,
    content: {
      overview:
        "A step-by-step method for consistently accessing flow states through environmental design and mental preparation.",
      steps: [
        "Clear all distractions from workspace",
        "Set specific, challenging but achievable goals",
        "Begin with 10-minute warm-up task",
        "Gradually increase task complexity",
        "Monitor and maintain optimal challenge level",
      ],
      tips: [
        "Match task difficulty to your current skill level",
        "Use binaural beats or focus music",
        "Take breaks before mental fatigue sets in",
      ],
      science:
        "Flow states are characterized by increased focus, reduced self-consciousness, and optimal performance through balanced challenge and skill.",
    },
  },
  {
    id: "4",
    title: "Cognitive Enhancement Stack",
    category: "nootropics",
    description: "Evidence-based nootropic combinations for mental performance",
    duration: "8 weeks",
    difficulty: "Advanced",
    completed: false,
    favorite: false,
    content: {
      overview:
        "A carefully designed nootropic protocol combining natural and synthetic compounds for enhanced cognitive function.",
      steps: [
        "Start with baseline cognitive testing",
        "Begin with single compounds (L-theanine + caffeine)",
        "Add racetams after 2 weeks if well-tolerated",
        "Include choline sources for brain health",
        "Cycle on/off to prevent tolerance",
      ],
      tips: [
        "Always start with lowest effective dose",
        "Keep detailed logs of effects and side effects",
        "Consult healthcare provider before starting",
      ],
      science:
        "Nootropics work through various mechanisms including neurotransmitter modulation, improved blood flow, and neuroprotection.",
    },
  },
]

export function LibraryHub() {
  const [protocols, setProtocols] = useState<Protocol[]>(mockProtocols)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null)

  const filteredProtocols = protocols.filter((protocol) => {
    const matchesCategory = selectedCategory === "all" || protocol.category === selectedCategory
    const matchesSearch =
      searchQuery === "" ||
      protocol.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      protocol.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleFavorite = (id: string) => {
    setProtocols(
      protocols.map((protocol) => (protocol.id === id ? { ...protocol, favorite: !protocol.favorite } : protocol)),
    )
  }

  const toggleCompleted = (id: string) => {
    setProtocols(
      protocols.map((protocol) => (protocol.id === id ? { ...protocol, completed: !protocol.completed } : protocol)),
    )
  }

  const getCompletionStats = () => {
    const completed = protocols.filter((p) => p.completed).length
    const total = protocols.length
    return { completed, total, percentage: Math.round((completed / total) * 100) }
  }

  const stats = getCompletionStats()

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "Intermediate":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "Advanced":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-muted"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Knowledge Library</h1>
        <p className="text-muted-foreground text-pretty">High-performance protocols and optimization guides</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Total Protocols</span>
            </div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Completed</span>
            </div>
            <div className="text-2xl font-bold text-green-500">{stats.completed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">Favorites</span>
            </div>
            <div className="text-2xl font-bold text-red-500">{protocols.filter((p) => p.favorite).length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">{stats.percentage}%</span>
          </div>
          <Progress value={stats.percentage} />
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search protocols..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid grid-cols-4 lg:grid-cols-7">
            <TabsTrigger value="all">All</TabsTrigger>
            {Object.entries(protocolCategories).map(([key, category]) => (
              <TabsTrigger key={key} value={key} className="hidden sm:flex">
                <category.icon className="h-4 w-4 mr-1" />
                <span className="hidden lg:inline">{category.name.split(" ")[0]}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Protocol Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProtocols.map((protocol) => {
          const categoryConfig = protocolCategories[protocol.category]
          const CategoryIcon = categoryConfig.icon

          return (
            <Card key={protocol.id} className="group hover:shadow-lg transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <CategoryIcon className={`h-5 w-5 ${categoryConfig.color}`} />
                    <Badge variant="outline" className={getDifficultyColor(protocol.difficulty)}>
                      {protocol.difficulty}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => toggleFavorite(protocol.id)}
                    >
                      <Star
                        className={`h-4 w-4 ${protocol.favorite ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => toggleCompleted(protocol.id)}
                    >
                      <CheckCircle
                        className={`h-4 w-4 ${protocol.completed ? "text-green-500" : "text-muted-foreground"}`}
                      />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-lg">{protocol.title}</CardTitle>
                <CardDescription className="line-clamp-2">{protocol.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {protocol.duration}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {categoryConfig.name}
                  </Badge>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full gap-2"
                      onClick={() => setSelectedProtocol(protocol)}
                      variant={protocol.completed ? "secondary" : "default"}
                    >
                      <Play className="h-4 w-4" />
                      {protocol.completed ? "Review" : "Start Protocol"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    {selectedProtocol && (
                      <>
                        <DialogHeader>
                          <div className="flex items-center gap-2 mb-2">
                            <CategoryIcon className={`h-5 w-5 ${categoryConfig.color}`} />
                            <Badge variant="outline" className={getDifficultyColor(selectedProtocol.difficulty)}>
                              {selectedProtocol.difficulty}
                            </Badge>
                          </div>
                          <DialogTitle className="text-xl">{selectedProtocol.title}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                          <div>
                            <h3 className="font-semibold mb-2">Overview</h3>
                            <p className="text-sm text-muted-foreground">{selectedProtocol.content.overview}</p>
                          </div>

                          <div>
                            <h3 className="font-semibold mb-2">Steps</h3>
                            <ol className="space-y-2">
                              {selectedProtocol.content.steps.map((step, index) => (
                                <li key={index} className="flex gap-3 text-sm">
                                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">
                                    {index + 1}
                                  </span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>

                          <div>
                            <h3 className="font-semibold mb-2">Pro Tips</h3>
                            <ul className="space-y-1">
                              {selectedProtocol.content.tips.map((tip, index) => (
                                <li key={index} className="flex gap-2 text-sm text-muted-foreground">
                                  <span className="text-primary">•</span>
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h3 className="font-semibold mb-2">The Science</h3>
                            <p className="text-sm text-muted-foreground">{selectedProtocol.content.science}</p>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              onClick={() => toggleCompleted(selectedProtocol.id)}
                              variant={selectedProtocol.completed ? "secondary" : "default"}
                              className="flex-1"
                            >
                              {selectedProtocol.completed ? "Mark Incomplete" : "Mark Complete"}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => toggleFavorite(selectedProtocol.id)}
                              className="bg-transparent"
                            >
                              <Star
                                className={`h-4 w-4 ${selectedProtocol.favorite ? "fill-yellow-500 text-yellow-500" : ""}`}
                              />
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* AI Companion Teaser */}
      <Card className="border-dashed">
        <CardContent className="text-center py-8">
          <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">AI Protocol Assistant</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Get personalized recommendations and ask questions about any protocol
          </p>
          <Button variant="outline" disabled className="bg-transparent">
            Coming Soon
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
