'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, Heart, Lock, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CelebrationProps {
  show: boolean
  onClose: () => void
  message?: string
  type?: 'success' | 'milestone' | 'encouragement'
}

const celebrationMessages = {
  success: [
    "Behavior logged successfully",
    "Data recorded",
    "Entry saved",
    "Successfully tracked",
    "Logged and saved",
  ],
  milestone: [
    "10 behaviors tracked",
    "One week of consistent tracking",
    "Strong tracking progress",
    "Excellent monthly progress",
  ],
  encouragement: [
    "Consistent tracking builds insights",
    "Every entry adds valuable data",
    "Your tracking supports better outcomes",
    "Regular logging reveals patterns",
  ],
}

export function Celebration({ show, onClose, message, type = 'success' }: CelebrationProps) {
  const [displayMessage, setDisplayMessage] = useState('')

  useEffect(() => {
    if (show) {
      // Pick random message
      const messages = celebrationMessages[type]
      setDisplayMessage(message || messages[Math.floor(Math.random() * messages.length)])

      // Auto-close after 2.5 seconds
      const timer = setTimeout(() => {
        onClose()
      }, 2500)

      return () => clearTimeout(timer)
    }
  }, [show, onClose, message, type])

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in">
      {/* Success Card */}
      <div className="relative animate-slide-up">
        <div className="bg-card border-2 border-border shadow-premium-hover rounded-xl p-8 max-w-md mx-4 text-center space-y-4">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center">
              {type === 'success' && <CheckCircle2 className="w-7 h-7 text-success" />}
              {type === 'milestone' && <Star className="w-7 h-7 text-accent" />}
              {type === 'encouragement' && <Heart className="w-7 h-7 text-primary" />}
            </div>
          </div>

          {/* Message */}
          <div>
            <h3 className="text-xl font-semibold mb-1 text-foreground">{displayMessage}</h3>
            <p className="text-sm text-muted-foreground">
              Building insights through consistent tracking
            </p>
          </div>

          {/* Privacy Note */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-lg px-4 py-2">
            <Lock className="w-3.5 h-3.5 text-primary" />
            <span>All data remains private on your device</span>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mt-2"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}
