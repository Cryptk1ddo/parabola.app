"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Bot,
  Send,
  Lightbulb,
  Target,
  TrendingUp,
  Calendar,
  Brain,
  Zap,
  Heart,
  Sparkles,
  Clock,
  CheckCircle,
} from "lucide-react"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  suggestions?: string[]
}

interface Insight {
  id: string
  type: "productivity" | "wellness" | "habits" | "focus"
  title: string
  description: string
  actionable: boolean
  priority: "high" | "medium" | "low"
  timestamp: Date
}

const mockInsights: Insight[] = [
  {
    id: "1",
    type: "productivity",
    title: "Peak Focus Hours Identified",
    description:
      "Your focus sessions are 40% more effective between 9-11 AM. Consider scheduling important work during this window.",
    actionable: true,
    priority: "high",
    timestamp: new Date(),
  },
  {
    id: "2",
    type: "habits",
    title: "Meditation Streak Building",
    description: "You've maintained meditation for 5 days straight. Research shows 21 days creates lasting habits.",
    actionable: false,
    priority: "medium",
    timestamp: new Date(),
  },
  {
    id: "3",
    type: "wellness",
    title: "Sleep Pattern Optimization",
    description: "Your energy levels correlate with 7.5+ hours of sleep. Consider adjusting your bedtime routine.",
    actionable: true,
    priority: "high",
    timestamp: new Date(),
  },
]

const quickPrompts = [
  "How can I improve my focus today?",
  "What's my productivity pattern?",
  "Suggest a morning routine",
  "How to build better habits?",
  "Optimize my supplement stack",
  "Create a study schedule",
]

const coachPersonalities = [
  { id: "motivational", name: "Motivational Coach", icon: Zap, description: "Energetic and encouraging" },
  { id: "analytical", name: "Data Analyst", icon: TrendingUp, description: "Insights and patterns" },
  { id: "wellness", name: "Wellness Guide", icon: Heart, description: "Holistic health focus" },
  { id: "productivity", name: "Productivity Expert", icon: Target, description: "Efficiency and systems" },
]

export function AICoach() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Hello! I'm your AI productivity coach. I've been analyzing your patterns and I'm here to help you optimize your performance. What would you like to work on today?",
      timestamp: new Date(),
      suggestions: ["Review my progress", "Plan my day", "Improve focus", "Build habits"],
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [selectedCoach, setSelectedCoach] = useState("motivational")
  const [activeTab, setActiveTab] = useState("chat")

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = {
        motivational: [
          "That's a fantastic goal! Let's break it down into actionable steps. Based on your recent patterns, I recommend starting with small wins to build momentum.",
          "I love your dedication! Your consistency has improved 30% this week. Let's keep that energy flowing with a strategic approach.",
          "You're on fire! 🔥 Your focus sessions have been stellar. Let's channel that energy into your next challenge.",
        ],
        analytical: [
          "Based on your data, I've identified 3 key optimization opportunities. Your peak performance window is 9-11 AM with 85% efficiency.",
          "Analyzing your patterns: 40% improvement in focus when you start with breathwork. The correlation is statistically significant.",
          "Your productivity metrics show a clear trend. Sessions following meditation are 60% longer and 45% more effective.",
        ],
        wellness: [
          "Let's focus on your holistic well-being. I notice your energy dips correlate with hydration levels. Small adjustments can yield big results.",
          "Your body is telling us something important. The connection between your sleep quality and next-day performance is remarkable.",
          "Balance is key. Your stress levels have decreased 25% since implementing the breathwork routine. Let's build on this foundation.",
        ],
        productivity: [
          "Efficiency is about systems, not just effort. Let's create a framework that works with your natural rhythms, not against them.",
          "I've identified 3 productivity leaks in your current system. Addressing these could save you 2+ hours daily.",
          "Your task completion rate is 78%. Let's implement the Eisenhower Matrix to push that above 90%.",
        ],
      }

      const coachResponses = responses[selectedCoach as keyof typeof responses]
      const randomResponse = coachResponses[Math.floor(Math.random() * coachResponses.length)]

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: randomResponse,
        timestamp: new Date(),
        suggestions: ["Tell me more", "Create an action plan", "Show me the data", "What's next?"],
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleQuickPrompt = (prompt: string) => {
    sendMessage(prompt)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-500/20 bg-red-500/5"
      case "medium":
        return "border-yellow-500/20 bg-yellow-500/5"
      case "low":
        return "border-green-500/20 bg-green-500/5"
      default:
        return "border-border"
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "productivity":
        return Target
      case "wellness":
        return Heart
      case "habits":
        return CheckCircle
      case "focus":
        return Brain
      default:
        return Lightbulb
    }
  }

  return (
    <div className="space-y-6 px-4 md:px-0">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-balance">AI Coach</h1>
        <p className="text-muted-foreground text-pretty text-sm md:text-base">
          Your personal productivity partner powered by AI
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="coaching">Coaching</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          {/* Coach Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Choose Your Coach</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {coachPersonalities.map((coach) => {
                  const CoachIcon = coach.icon
                  return (
                    <Button
                      key={coach.id}
                      variant={selectedCoach === coach.id ? "default" : "outline"}
                      size="sm"
                      className="h-auto p-3 flex flex-col gap-1"
                      onClick={() => setSelectedCoach(coach.id)}
                    >
                      <CoachIcon className="h-4 w-4" />
                      <span className="text-xs font-medium">{coach.name.split(" ")[0]}</span>
                    </Button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Chat Interface */}
          <Card className="h-[500px] flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">
                  {coachPersonalities.find((c) => c.id === selectedCoach)?.name}
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  Online
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col pt-0">
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.type === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        {message.suggestions && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {message.suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs bg-background/50 hover:bg-background/80"
                                onClick={() => handleQuickPrompt(suggestion)}
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Quick Prompts */}
              <div className="mt-4 mb-3">
                <div className="flex flex-wrap gap-2">
                  {quickPrompts.slice(0, 3).map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs h-7 bg-transparent"
                      onClick={() => handleQuickPrompt(prompt)}
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Ask your coach anything..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage(inputMessage)}
                  className="flex-1"
                />
                <Button size="sm" onClick={() => sendMessage(inputMessage)} disabled={!inputMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">AI Insights</h2>
            <Badge variant="outline" className="gap-1">
              <Sparkles className="h-3 w-3" />
              {mockInsights.length} insights
            </Badge>
          </div>

          <div className="space-y-3">
            {mockInsights.map((insight) => {
              const InsightIcon = getInsightIcon(insight.type)
              return (
                <Card key={insight.id} className={`${getPriorityColor(insight.priority)} border`}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <InsightIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm">{insight.title}</h3>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              insight.priority === "high"
                                ? "border-red-500/50 text-red-600"
                                : insight.priority === "medium"
                                  ? "border-yellow-500/50 text-yellow-600"
                                  : "border-green-500/50 text-green-600"
                            }`}
                          >
                            {insight.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>Just now</span>
                          </div>
                          {insight.actionable && (
                            <Button size="sm" variant="outline" className="h-7 text-xs bg-transparent">
                              Take Action
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="coaching" className="space-y-4">
          <h2 className="text-xl font-semibold">Personalized Coaching</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Goal Setting
                </CardTitle>
                <CardDescription>AI-powered goal recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-muted rounded-lg">
                    <h4 className="font-medium text-sm mb-1">Suggested Goal</h4>
                    <p className="text-sm text-muted-foreground">
                      Increase daily focus time to 3 hours with 90% consistency
                    </p>
                  </div>
                  <Button size="sm" className="w-full">
                    Accept Goal
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Daily Planning
                </CardTitle>
                <CardDescription>Optimized schedule suggestions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-muted rounded-lg">
                    <h4 className="font-medium text-sm mb-1">Today's Plan</h4>
                    <p className="text-sm text-muted-foreground">
                      9 AM: Deep work (2h) → 11 AM: Break → 11:30 AM: Meetings
                    </p>
                  </div>
                  <Button size="sm" className="w-full">
                    Apply Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Cognitive Training
                </CardTitle>
                <CardDescription>Personalized brain exercises</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-muted rounded-lg">
                    <h4 className="font-medium text-sm mb-1">Recommended Exercise</h4>
                    <p className="text-sm text-muted-foreground">Working memory training - 15 minutes daily</p>
                  </div>
                  <Button size="sm" className="w-full" disabled>
                    Coming Soon
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance Analysis
                </CardTitle>
                <CardDescription>Weekly performance review</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-muted rounded-lg">
                    <h4 className="font-medium text-sm mb-1">This Week</h4>
                    <p className="text-sm text-muted-foreground">85% goal completion, 15% improvement from last week</p>
                  </div>
                  <Button size="sm" className="w-full">
                    View Full Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
