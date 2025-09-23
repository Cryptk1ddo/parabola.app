"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  Search,
  Lightbulb,
  Zap,
  BookOpen,
  Hash,
  Trash2,
  Edit,
  Star,
  Archive,
  Pin,
  Mic,
  Camera,
  Link,
  Clock,
} from "lucide-react"

interface Note {
  id: string
  title: string
  content: string
  category: "quick" | "insight" | "swipe"
  tags: string[]
  createdAt: Date
  updatedAt: Date
  isPinned: boolean
  isStarred: boolean
  isArchived: boolean
  attachments?: string[]
}

const mockNotes: Note[] = [
  {
    id: "1",
    title: "Meeting follow-up",
    content:
      "Need to follow up with Sarah about the project timeline. She mentioned the deadline might be flexible. Key points: 1) Review current progress 2) Discuss resource allocation 3) Set new milestones",
    category: "quick",
    tags: ["work", "meeting", "urgent"],
    createdAt: new Date("2024-01-15T10:30:00"),
    updatedAt: new Date("2024-01-15T10:30:00"),
    isPinned: true,
    isStarred: false,
    isArchived: false,
  },
  {
    id: "2",
    title: "Flow State Discovery",
    content:
      "Realized that I enter flow state most easily when I start with a 10-minute warm-up task. The key is to begin with something familiar that doesn't require deep thinking, then gradually increase complexity. This creates a mental runway that helps transition into deeper work. Temperature also matters - slightly cool room (68-70°F) seems optimal.",
    category: "insight",
    tags: ["productivity", "flow", "breakthrough", "environment"],
    createdAt: new Date("2024-01-14T14:20:00"),
    updatedAt: new Date("2024-01-14T14:20:00"),
    isPinned: false,
    isStarred: true,
    isArchived: false,
  },
  {
    id: "3",
    title: "Great Quote on Focus",
    content:
      '"The successful warrior is the average man with laser-like focus." - Bruce Lee\n\nThis resonates because it emphasizes that extraordinary results come not from extraordinary talent, but from extraordinary focus. Focus is a skill that can be developed.',
    category: "swipe",
    tags: ["quotes", "focus", "inspiration", "bruce-lee"],
    createdAt: new Date("2024-01-13T09:15:00"),
    updatedAt: new Date("2024-01-13T09:15:00"),
    isPinned: false,
    isStarred: true,
    isArchived: false,
  },
  {
    id: "4",
    title: "Grocery list",
    content:
      "- Organic spinach\n- Blueberries\n- Greek yogurt\n- Salmon\n- Sweet potatoes\n- Avocados\n- Dark chocolate (85%)\n- Green tea",
    category: "quick",
    tags: ["shopping", "health", "food"],
    createdAt: new Date("2024-01-12T18:45:00"),
    updatedAt: new Date("2024-01-12T18:45:00"),
    isPinned: false,
    isStarred: false,
    isArchived: false,
  },
  {
    id: "5",
    title: "Morning Routine Optimization",
    content:
      "After tracking for 2 weeks, discovered that starting with 5 minutes of breathwork before coffee significantly improves focus throughout the day. The key insight: caffeine + calm nervous system = sustained energy without jitters. Order matters: breathwork → hydration → coffee → movement.",
    category: "insight",
    tags: ["morning-routine", "breathwork", "caffeine", "optimization"],
    createdAt: new Date("2024-01-11T07:30:00"),
    updatedAt: new Date("2024-01-11T07:30:00"),
    isPinned: false,
    isStarred: false,
    isArchived: false,
  },
]

const categoryConfig = {
  quick: {
    name: "Quick Dump",
    description: "Random thoughts, tasks, ideas",
    icon: Zap,
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    mobileColor: "text-blue-500",
  },
  insight: {
    name: "Insight Journal",
    description: "Lessons, breakthroughs, learnings",
    icon: Lightbulb,
    color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    mobileColor: "text-yellow-500",
  },
  swipe: {
    name: "Swipe File",
    description: "Quotes, ideas, copy inspiration",
    icon: BookOpen,
    color: "bg-green-500/10 text-green-500 border-green-500/20",
    mobileColor: "text-green-500",
  },
}

type SortOption = "newest" | "oldest" | "title" | "updated"

export function NotesCapture() {
  const [notes, setNotes] = useState<Note[]>(mockNotes)
  const [activeCategory, setActiveCategory] = useState<"quick" | "insight" | "swipe">("quick")
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>("newest")
  const [showArchived, setShowArchived] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    tags: "",
  })

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const filteredNotes = notes.filter((note) => {
    const matchesCategory = note.category === activeCategory
    const matchesArchived = showArchived ? note.isArchived : !note.isArchived
    const matchesSearch =
      searchQuery === "" ||
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => note.tags.includes(tag))
    return matchesCategory && matchesArchived && matchesSearch && matchesTags
  })

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    // Always show pinned notes first
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1

    switch (sortBy) {
      case "newest":
        return b.createdAt.getTime() - a.createdAt.getTime()
      case "oldest":
        return a.createdAt.getTime() - b.createdAt.getTime()
      case "title":
        return a.title.localeCompare(b.title)
      case "updated":
        return b.updatedAt.getTime() - a.updatedAt.getTime()
      default:
        return 0
    }
  })

  const handleAddNote = () => {
    if (newNote.title.trim() || newNote.content.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        title: newNote.title || "Untitled",
        content: newNote.content,
        category: activeCategory,
        tags: newNote.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        createdAt: new Date(),
        updatedAt: new Date(),
        isPinned: false,
        isStarred: false,
        isArchived: false,
      }
      setNotes([note, ...notes])
      setNewNote({ title: "", content: "", tags: "" })
      setIsAddingNote(false)
    }
  }

  const handleNoteAction = (id: string, action: "pin" | "star" | "archive" | "delete") => {
    setNotes(
      notes
        .map((note) => {
          if (note.id === id) {
            switch (action) {
              case "pin":
                return { ...note, isPinned: !note.isPinned }
              case "star":
                return { ...note, isStarred: !note.isStarred }
              case "archive":
                return { ...note, isArchived: !note.isArchived }
              default:
                return note
            }
          }
          return note
        })
        .filter((note) => action !== "delete" || note.id !== id),
    )
  }

  const handleEditNote = (note: Note) => {
    setEditingNote(note)
    setNewNote({
      title: note.title,
      content: note.content,
      tags: note.tags.join(", "),
    })
  }

  const handleUpdateNote = () => {
    if (editingNote && (newNote.title.trim() || newNote.content.trim())) {
      setNotes(
        notes.map((note) =>
          note.id === editingNote.id
            ? {
                ...note,
                title: newNote.title || "Untitled",
                content: newNote.content,
                tags: newNote.tags
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter(Boolean),
                updatedAt: new Date(),
              }
            : note,
        ),
      )
      setEditingNote(null)
      setNewNote({ title: "", content: "", tags: "" })
    }
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else if (diffInHours < 48) {
      return "Yesterday"
    } else {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date)
    }
  }

  const getCategoryStats = () => {
    const stats = {
      quick: notes.filter((n) => n.category === "quick" && !n.isArchived).length,
      insight: notes.filter((n) => n.category === "insight" && !n.isArchived).length,
      swipe: notes.filter((n) => n.category === "swipe" && !n.isArchived).length,
    }
    return stats
  }

  const getAllTags = () => {
    const allTags = notes.flatMap((note) => note.tags)
    return [...new Set(allTags)].sort()
  }

  const stats = getCategoryStats()
  const allTags = getAllTags()

  const QuickAddButton = () => (
    <Button
      className={`${isMobile ? "fixed bottom-24 right-4 h-14 w-14 rounded-full shadow-lg z-40" : "w-full gap-2"}`}
      onClick={() => setIsAddingNote(true)}
    >
      <Plus className="h-5 w-5" />
      {!isMobile && "Add Note"}
    </Button>
  )

  const NoteDialog = ({ isEdit = false }: { isEdit?: boolean }) => {
    const DialogComponent = isMobile ? Sheet : Dialog
    const DialogContentComponent = isMobile ? SheetContent : DialogContent
    const DialogHeaderComponent = isMobile ? SheetHeader : DialogHeader
    const DialogTitleComponent = isMobile ? SheetTitle : DialogTitle

    return (
      <DialogComponent
        open={isEdit ? !!editingNote : isAddingNote}
        onOpenChange={isEdit ? () => setEditingNote(null) : setIsAddingNote}
      >
        <DialogContentComponent className={isMobile ? "h-[90vh]" : ""}>
          <DialogHeaderComponent>
            <DialogTitleComponent>
              {isEdit ? "Edit Note" : `Add to ${categoryConfig[activeCategory].name}`}
            </DialogTitleComponent>
          </DialogHeaderComponent>
          <div className="space-y-4 flex-1">
            <div className="space-y-2">
              <Label>Title (optional)</Label>
              <Input
                placeholder="Enter title..."
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              />
            </div>
            <div className="space-y-2 flex-1">
              <Label>Content</Label>
              <Textarea
                placeholder="Write your note..."
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                rows={isMobile ? 8 : 4}
                className="resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label>Tags (comma separated)</Label>
              <Input
                placeholder="work, ideas, important"
                value={newNote.tags}
                onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
              />
            </div>
            {isMobile && (
              <div className="flex gap-2 pt-4">
                <Button variant="outline" size="sm" className="flex-1 gap-2 bg-transparent">
                  <Mic className="h-4 w-4" />
                  Voice
                </Button>
                <Button variant="outline" size="sm" className="flex-1 gap-2 bg-transparent">
                  <Camera className="h-4 w-4" />
                  Photo
                </Button>
                <Button variant="outline" size="sm" className="flex-1 gap-2 bg-transparent">
                  <Link className="h-4 w-4" />
                  Link
                </Button>
              </div>
            )}
            <div className="flex gap-2 pt-4">
              <Button onClick={isEdit ? handleUpdateNote : handleAddNote} className="flex-1">
                {isEdit ? "Update Note" : "Add Note"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (isEdit) {
                    setEditingNote(null)
                  } else {
                    setIsAddingNote(false)
                  }
                  setNewNote({ title: "", content: "", tags: "" })
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContentComponent>
      </DialogComponent>
    )
  }

  return (
    <div className={`space-y-4 ${isMobile ? "px-4 pb-4" : "space-y-6"}`}>
      <div>
        <h1 className={`font-bold text-balance ${isMobile ? "text-2xl" : "text-3xl"}`}>Capture & Notes</h1>
        <p className={`text-muted-foreground text-pretty ${isMobile ? "text-sm" : ""}`}>
          Quick capture system for ideas, insights, and inspiration
        </p>
      </div>

      <div className={`grid gap-3 ${isMobile ? "grid-cols-3" : "grid-cols-3 gap-4"}`}>
        {Object.entries(categoryConfig).map(([key, config]) => {
          const Icon = config.icon
          const count = stats[key as keyof typeof stats]
          const isActive = activeCategory === key
          return (
            <Card
              key={key}
              className={`text-center cursor-pointer transition-all ${
                isActive ? "ring-2 ring-primary" : "hover:shadow-md"
              } ${isMobile ? "py-3" : ""}`}
              onClick={() => setActiveCategory(key as any)}
            >
              <CardContent className={isMobile ? "pt-3 pb-2" : "pt-6"}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Icon className={`h-4 w-4 ${isActive ? config.mobileColor : "text-muted-foreground"}`} />
                  <span className={`font-semibold ${isMobile ? "text-sm" : ""}`}>
                    {isMobile ? config.name.split(" ")[0] : config.name}
                  </span>
                </div>
                <div className={`font-bold text-primary ${isMobile ? "text-xl" : "text-2xl"}`}>{count}</div>
                {!isMobile && <p className="text-xs text-muted-foreground">{config.description}</p>}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className={`${isMobile ? "space-y-3" : "grid gap-6 lg:grid-cols-4"}`}>
        {!isMobile && (
          <div className="lg:col-span-1 space-y-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Tabs
                value={activeCategory}
                onValueChange={(value) => setActiveCategory(value as any)}
                orientation="vertical"
              >
                <TabsList className="grid w-full grid-cols-1 h-auto">
                  {Object.entries(categoryConfig).map(([key, config]) => {
                    const Icon = config.icon
                    return (
                      <TabsTrigger key={key} value={key} className="justify-start gap-2 data-[state=active]:bg-primary">
                        <Icon className="h-4 w-4" />
                        {config.name}
                      </TabsTrigger>
                    )
                  })}
                </TabsList>
              </Tabs>
            </div>

            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Sort by</Label>
              <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest first</SelectItem>
                  <SelectItem value="oldest">Oldest first</SelectItem>
                  <SelectItem value="title">Title A-Z</SelectItem>
                  <SelectItem value="updated">Recently updated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {allTags.length > 0 && (
              <div className="space-y-2">
                <Label>Filter by tags</Label>
                <div className="flex flex-wrap gap-1">
                  {allTags.slice(0, 8).map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "secondary"}
                      className="cursor-pointer text-xs"
                      onClick={() => {
                        setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <QuickAddButton />
          </div>
        )}

        {isMobile && (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="updated">Updated</SelectItem>
                </SelectContent>
              </Select>
              {allTags.length > 0 && (
                <div className="flex gap-1">
                  {allTags.slice(0, 4).map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "secondary"}
                      className="cursor-pointer text-xs whitespace-nowrap"
                      onClick={() => {
                        setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notes List */}
        <div className={isMobile ? "" : "lg:col-span-3"}>
          <div className="space-y-3">
            {sortedNotes.length === 0 ? (
              <Card>
                <CardContent className={`text-center ${isMobile ? "py-8" : "py-12"}`}>
                  <div className="text-muted-foreground">
                    {searchQuery || selectedTags.length > 0
                      ? "No notes match your filters"
                      : `No notes in ${categoryConfig[activeCategory].name} yet`}
                  </div>
                  <Button
                    variant="outline"
                    className="mt-4 bg-transparent"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedTags([])
                      setIsAddingNote(true)
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add your first note
                  </Button>
                </CardContent>
              </Card>
            ) : (
              sortedNotes.map((note) => {
                const config = categoryConfig[note.category]
                const Icon = config.icon
                return (
                  <Card key={note.id} className="group hover:shadow-md transition-all">
                    <CardHeader className={`${isMobile ? "pb-2" : "pb-3"}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {note.isPinned && <Pin className="h-3 w-3 text-primary flex-shrink-0" />}
                          <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <CardTitle className={`${isMobile ? "text-sm" : "text-base"} truncate`}>
                            {note.title}
                          </CardTitle>
                          {note.isStarred && <Star className="h-3 w-3 text-yellow-500 flex-shrink-0" />}
                        </div>
                        <div
                          className={`flex items-center gap-1 ${isMobile ? "" : "opacity-0 group-hover:opacity-100"} transition-opacity`}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleNoteAction(note.id, "star")}
                          >
                            <Star className={`h-3 w-3 ${note.isStarred ? "text-yellow-500 fill-current" : ""}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleNoteAction(note.id, "pin")}
                          >
                            <Pin className={`h-3 w-3 ${note.isPinned ? "text-primary" : ""}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditNote(note)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          {!isMobile && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => handleNoteAction(note.id, "archive")}
                              >
                                <Archive className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                onClick={() => handleNoteAction(note.id, "delete")}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDate(note.createdAt)}
                        {note.updatedAt.getTime() !== note.createdAt.getTime() && (
                          <span>• edited {formatDate(note.updatedAt)}</span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p
                        className={`text-muted-foreground mb-3 ${isMobile ? "text-sm line-clamp-2" : "text-sm line-clamp-3"}`}
                      >
                        {note.content}
                      </p>
                      {note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {note.tags.slice(0, isMobile ? 3 : 5).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              <Hash className="h-2 w-2 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                          {note.tags.length > (isMobile ? 3 : 5) && (
                            <Badge variant="secondary" className="text-xs">
                              +{note.tags.length - (isMobile ? 3 : 5)}
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </div>
      </div>

      {isMobile && <QuickAddButton />}

      {/* Add/Edit Note Dialog */}
      <NoteDialog />
      <NoteDialog isEdit />
    </div>
  )
}
