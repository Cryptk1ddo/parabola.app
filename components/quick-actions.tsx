"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Target, Wind, CheckCircle, Timer, PenTool, Brain } from "lucide-react"

interface QuickAction {
  id: string
  title: string
  description: string
  icon: any
  color: string
  action: () => void
}

export function QuickActions() {
  const [quickNoteOpen, setQuickNoteOpen] = useState(false)
  const [quickNote, setQuickNote] = useState("")
  const [quickGoalOpen, setQuickGoalOpen] = useState(false)
  const [quickGoal, setQuickGoal] = useState("")

  const quickActions: QuickAction[] = [
    {
      id: "focus-25",
      title: "Quick Focus",
      description: "Start 25min session",
      icon: Timer,
      color: "text-orange-500",
      action: () => {
        // Start 25-minute focus session
        console.log("Starting 25-minute focus session")
      },
    },
    {
      id: "breathwork",
      title: "Breathe",
      description: "5min breathing",
      icon: Wind,
      color: "text-blue-500",
      action: () => {
        // Start breathing exercise
        console.log("Starting breathing exercise")
      },
    },
    {
      id: "quick-note",
      title: "Quick Note",
      description: "Capture thought",
      icon: PenTool,
      color: "text-green-500",
      action: () => setQuickNoteOpen(true),
    },
    {
      id: "set-goal",
      title: "Set Goal",
      description: "Daily objective",
      icon: Target,
      color: "text-purple-500",
      action: () => setQuickGoalOpen(true),
    },
    {
      id: "brain-break",
      title: "Brain Break",
      description: "Quick recharge",
      icon: Brain,
      color: "text-pink-500",
      action: () => {
        // Start brain break activity
        console.log("Starting brain break")
      },
    },
    {
      id: "check-habits",
      title: "Check Habits",
      description: "Mark complete",
      icon: CheckCircle,
      color: "text-emerald-500",
      action: () => {
        // Open habits quick check
        console.log("Opening habits quick check")
      },
    },
  ]

  const handleSaveNote = () => {
    if (quickNote.trim()) {
      // Save the note
      console.log("Saving quick note:", quickNote)
      setQuickNote("")
      setQuickNoteOpen(false)
    }
  }

  const handleSaveGoal = () => {
    if (quickGoal.trim()) {
      // Save the goal
      console.log("Saving quick goal:", quickGoal)
      setQuickGoal("")
      setQuickGoalOpen(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Quick Actions</h2>
        <p className="text-sm text-muted-foreground">Fast access to your most-used productivity tools</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon
          return (
            <Card
              key={action.id}
              className="cursor-pointer hover:shadow-md transition-all duration-200 mobile-card"
              onClick={action.action}
            >
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="p-3 rounded-full bg-muted">
                    <Icon className={`h-6 w-6 ${action.color}`} />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{action.title}</h3>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Note Dialog */}
      <Dialog open={quickNoteOpen} onOpenChange={setQuickNoteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Quick Note</DialogTitle>
            <DialogDescription>Capture a quick thought or idea</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="What's on your mind?"
              value={quickNote}
              onChange={(e) => setQuickNote(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setQuickNoteOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveNote} disabled={!quickNote.trim()}>
                Save Note
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quick Goal Dialog */}
      <Dialog open={quickGoalOpen} onOpenChange={setQuickGoalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Set Daily Goal</DialogTitle>
            <DialogDescription>What do you want to accomplish today?</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Enter your goal..." value={quickGoal} onChange={(e) => setQuickGoal(e.target.value)} />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setQuickGoalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveGoal} disabled={!quickGoal.trim()}>
                Set Goal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
