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
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">Ash</span>
            <span className="text-sm text-muted-foreground hidden sm:inline">
              Behavior Tracker
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </div>

          {/* Mobile Navigation - Bottom Fixed */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t z-50">
            <div className="flex items-center justify-around">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex flex-col items-center gap-1 px-3 py-3 text-xs font-medium transition-colors flex-1',
                      isActive
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-[10px]">{item.name}</span>
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
