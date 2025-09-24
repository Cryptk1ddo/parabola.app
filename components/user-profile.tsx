"use client"

import { UserButton, useUser, SignInButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { User, Settings, LogOut, Crown } from "lucide-react"

export function UserProfile() {
  const { isSignedIn, user, isLoaded } = useUser()

  if (!isLoaded) {
    return (
      <div className="w-8 h-8 bg-muted animate-pulse rounded-full" />
    )
  }

  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <Button variant="outline" size="sm" className="gap-2">
          <User className="h-4 w-4" />
          Sign In
        </Button>
      </SignInButton>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <div className="hidden sm:flex flex-col text-right">
        <span className="text-sm font-medium text-foreground">
          {user.firstName} {user.lastName}
        </span>
        <span className="text-xs text-muted-foreground">
          {user.primaryEmailAddress?.emailAddress}
        </span>
      </div>
      
      <UserButton 
        appearance={{
          elements: {
            avatarBox: "w-8 h-8",
            userButtonPopoverCard: "bg-card border border-border shadow-lg",
            userButtonPopoverActionButton: "text-foreground hover:bg-accent",
            userButtonPopoverActionButtonText: "text-foreground",
            userButtonPopoverActionButtonIcon: "text-muted-foreground",
            userButtonPopoverFooter: "hidden" // Hide the Clerk branding
          }
        }}
        userProfileProps={{
          appearance: {
            elements: {
              card: "bg-card border border-border",
              headerTitle: "text-foreground",
              headerSubtitle: "text-muted-foreground",
              formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground"
            }
          }
        }}
      />
    </div>
  )
}