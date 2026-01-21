'use client'

import { Shield, Lock, Database, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PrivacyBadgeProps {
  variant?: 'minimal' | 'detailed' | 'banner'
  className?: string
}

export function PrivacyBadge({ variant = 'minimal', className }: PrivacyBadgeProps) {
  if (variant === 'minimal') {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium',
          className
        )}
      >
        <Shield className="w-4 h-4" />
        <span>100% Private</span>
      </div>
    )
  }

  if (variant === 'banner') {
    return (
      <div
        className={cn(
          'bg-gradient-to-r from-primary/5 via-primary/10 to-accent/5 border border-primary/20 rounded-xl p-6',
          className
        )}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              Your Privacy is Our Priority
              <Lock className="w-4 h-4 text-primary" />
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              All behavior data stays on <strong>your device</strong>. No cloud storage, no
              accounts, no tracking. You control your data completely.
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Database className="w-4 h-4 text-primary" />
                <span>Local storage only</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <EyeOff className="w-4 h-4 text-primary" />
                <span>No third parties</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-primary" />
                <span>HIPAA-friendly</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // detailed variant
  return (
    <div
      className={cn(
        'bg-card border border-border rounded-lg p-4 space-y-3',
        className
      )}
    >
      <div className="flex items-center gap-2 text-primary font-semibold">
        <Shield className="w-5 h-5" />
        <span>Privacy-First Design</span>
      </div>
      <ul className="space-y-2 text-sm text-muted-foreground">
        <li className="flex items-start gap-2">
          <Lock className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
          <span>All data stored locally in your browser</span>
        </li>
        <li className="flex items-start gap-2">
          <Database className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
          <span>No accounts or registration required</span>
        </li>
        <li className="flex items-start gap-2">
          <EyeOff className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
          <span>Playful animal names protect identity</span>
        </li>
        <li className="flex items-start gap-2">
          <Eye className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
          <span>You control what gets exported</span>
        </li>
      </ul>
    </div>
  )
}

export function PrivacyFeatureGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-card border border-border rounded-xl p-6 text-center space-y-3 hover:shadow-soft transition-shadow">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6 text-primary" />
        </div>
        <h3 className="font-semibold">No Cloud Storage</h3>
        <p className="text-sm text-muted-foreground">
          Data never leaves your device. Complete control over your information.
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 text-center space-y-3 hover:shadow-soft transition-smooth">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <EyeOff className="w-6 h-6 text-primary" />
        </div>
        <h3 className="font-semibold">Anonymous Profiles</h3>
        <p className="text-sm text-muted-foreground">
          Playful animal names like "Brave Panda" protect privacy automatically.
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 text-center space-y-3 hover:shadow-soft transition-smooth">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <h3 className="font-semibold">You Own Your Data</h3>
        <p className="text-sm text-muted-foreground">
          Export anytime. Delete anytime. No strings attached.
        </p>
      </div>
    </div>
  )
}
