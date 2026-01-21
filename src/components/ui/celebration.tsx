'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, Heart, Sparkles, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CelebrationProps {
  show: boolean
  onClose: () => void
  message?: string
  type?: 'success' | 'milestone' | 'encouragement'
}

const celebrationMessages = {
  success: [
    "Great job logging that!",
    "You're making a difference!",
    "Data recorded successfully!",
    "Another step toward understanding!",
    "Thank you for tracking this!",
  ],
  milestone: [
    "🎉 You've logged 10 behaviors!",
    "🌟 One week of consistent tracking!",
    "💪 You're building great habits!",
    "📊 Amazing progress this month!",
  ],
  encouragement: [
    "You're doing an amazing job!",
    "Every log helps build understanding",
    "Your dedication is inspiring!",
    "This tracking makes a real difference!",
  ],
}

export function Celebration({ show, onClose, message, type = 'success' }: CelebrationProps) {
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; delay: number }>>([])
  const [displayMessage, setDisplayMessage] = useState('')

  useEffect(() => {
    if (show) {
      // Generate confetti
      const newConfetti = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.3,
      }))
      setConfetti(newConfetti)

      // Pick random message
      const messages = celebrationMessages[type]
      setDisplayMessage(message || messages[Math.floor(Math.random() * messages.length)])

      // Auto-close after 3 seconds
      const timer = setTimeout(() => {
        onClose()
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [show, onClose, message, type])

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm animate-fade-in">
      {/* Confetti */}
      {confetti.map((item) => (
        <div
          key={item.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${item.left}%`,
            top: '50%',
            animationDelay: `${item.delay}s`,
            background: item.id % 3 === 0
              ? 'hsl(var(--primary))'
              : item.id % 3 === 1
              ? 'hsl(var(--accent))'
              : 'hsl(var(--success))',
            animation: 'confetti 2s ease-out forwards',
          }}
        />
      ))}

      {/* Success Card */}
      <div className="relative animate-celebrate">
        <div className="bg-card shadow-elevated rounded-2xl p-8 max-w-md mx-4 text-center space-y-4">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
              {type === 'success' && <CheckCircle2 className="w-10 h-10 text-success" />}
              {type === 'milestone' && <Star className="w-10 h-10 text-accent" />}
              {type === 'encouragement' && <Heart className="w-10 h-10 text-primary" />}
            </div>
          </div>

          {/* Message */}
          <div>
            <h3 className="text-2xl font-bold mb-2">{displayMessage}</h3>
            <p className="text-muted-foreground">
              Your tracking helps build patterns and insights
            </p>
          </div>

          {/* Privacy Note */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>All data stays private on your device</span>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}
