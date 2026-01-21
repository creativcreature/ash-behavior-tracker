'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, ClipboardList, BarChart3, FileDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Profiles', href: '/children', icon: Users },
  { name: 'Track', href: '/track', icon: ClipboardList },
  { name: 'Insights', href: '/insights', icon: BarChart3 },
  { name: 'Export', href: '/export', icon: FileDown },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur-xl sticky top-0 z-40 transition-premium">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shadow-sm">
              <span className="text-primary-foreground font-bold text-lg">A</span>
            </div>
            <div>
              <span className="text-xl font-bold text-foreground tracking-tight">
                Ash
              </span>
              <p className="text-xs text-muted-foreground hidden sm:block leading-none mt-0.5">
                Privacy-First Tracking
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-premium',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-premium'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </div>

          {/* Mobile Navigation - Bottom Fixed */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/98 backdrop-blur-xl border-t border-border z-50 shadow-premium">
            <div className="flex items-center justify-around px-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex flex-col items-center gap-1.5 px-3 py-3 text-xs font-medium transition-premium flex-1 relative',
                      isActive
                        ? 'text-primary'
                        : 'text-muted-foreground active:text-foreground'
                    )}
                  >
                    {isActive && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-primary rounded-full" />
                    )}
                    <Icon className={cn("h-5 w-5", isActive && "scale-110")} />
                    <span className="text-[10px] leading-tight">{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
