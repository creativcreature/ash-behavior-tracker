'use client'

import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useChildrenStore } from '@/store/childrenStore'
import { useBehaviorsStore } from '@/store/behaviorsStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Shield,
  Lock,
  BarChart3,
  FileText,
  Clock,
  Users,
  TrendingUp,
  Calendar,
  Activity,
  CheckCircle2,
  ArrowRight,
  Eye,
  Download,
} from 'lucide-react'
import { format, subDays, startOfDay, endOfDay } from 'date-fns'

export default function Home() {
  const router = useRouter()
  const { children, selectedChildId, fetchChildren, selectChild } = useChildrenStore()
  const { incidents, fetchIncidents } = useBehaviorsStore()

  useEffect(() => {
    fetchChildren()
    fetchIncidents()
  }, [fetchChildren, fetchIncidents])

  const activeChildren = children.filter((c) => !c.archivedAt)
  const selectedChild = children.find((c) => c.id === selectedChildId)

  const stats = useMemo(() => {
    if (!selectedChildId) {
      return { total: 0, today: 0, last7Days: 0, avgPerDay: 0, mostCommonType: null }
    }

    const childIncidents = incidents.filter((i) => i.childId === selectedChildId)
    const now = new Date()
    const todayStart = startOfDay(now)
    const todayEnd = endOfDay(now)
    const sevenDaysAgo = subDays(now, 7)

    const todayIncidents = childIncidents.filter(
      (i) => new Date(i.timestamp) >= todayStart && new Date(i.timestamp) <= todayEnd
    )
    const last7DaysIncidents = childIncidents.filter(
      (i) => new Date(i.timestamp) >= sevenDaysAgo
    )

    const typeCounts: Record<string, number> = {}
    childIncidents.forEach((incident) => {
      typeCounts[incident.behaviorType] = (typeCounts[incident.behaviorType] || 0) + 1
    })

    const mostCommonType = Object.keys(typeCounts).length
      ? Object.entries(typeCounts).reduce((a, b) => (b[1] > a[1] ? b : a))[0]
      : null

    return {
      total: childIncidents.length,
      today: todayIncidents.length,
      last7Days: last7DaysIncidents.length,
      avgPerDay: last7DaysIncidents.length / 7,
      mostCommonType,
    }
  }, [selectedChildId, incidents])

  const recentIncidents = useMemo(() => {
    if (!selectedChildId) return []
    return incidents.filter((i) => i.childId === selectedChildId).slice(0, 5)
  }, [selectedChildId, incidents])

  // First-time landing page
  if (activeChildren.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-6 py-16 max-w-7xl">
          {/* Hero */}
          <div className="max-w-4xl mx-auto text-center mb-24">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-sm font-medium mb-8">
              <Shield className="w-4 h-4 text-primary" />
              <span>Privacy-First Behavior Tracking</span>
            </div>

            <h1 className="mb-6">
              Professional Behavior Analysis
            </h1>

            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              Clinical-grade behavior tracking for children with autism and developmental delays.
              <br />
              Trusted by parents, therapists, and BCBAs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => router.push('/children')}
                className="gap-2 px-8"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  const el = document.getElementById('features')
                  el?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Privacy Banner */}
          <div className="max-w-5xl mx-auto mb-24">
            <div className="bg-accent-light/30 border border-accent/20 rounded-lg p-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Lock className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Your Data Stays Private</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    All behavior data is stored locally on your device. No cloud storage, no accounts, no tracking.
                    You maintain complete control over your information.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div id="features" className="mb-24">
            <div className="text-center mb-16">
              <h2 className="mb-4">Comprehensive Behavior Insights</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need for professional behavior analysis
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-2 transition-premium hover:shadow-premium-hover">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Quick Logging</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Record behaviors in under 5 seconds with Quick Mode, or capture detailed ABC data when needed.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 transition-premium hover:shadow-premium-hover">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <BarChart3 className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Visual Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Interactive charts reveal patterns over time. Identify triggers and track progress with clarity.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 transition-premium hover:shadow-premium-hover">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Professional Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Export CSV reports compatible with Excel and professional behavior analysis software.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 transition-premium hover:shadow-premium-hover">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-accent" />
                  </div>
                  <CardTitle className="text-lg">Local Storage Only</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    All data remains on your device. No cloud, no servers, no third parties. Complete privacy.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 transition-premium hover:shadow-premium-hover">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <Eye className="w-6 h-6 text-accent" />
                  </div>
                  <CardTitle className="text-lg">Anonymous by Design</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Profiles use playful code names for automatic identity protection in all exports.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 transition-premium hover:shadow-premium-hover">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-6 h-6 text-accent" />
                  </div>
                  <CardTitle className="text-lg">Fully Accessible</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    WCAG AA compliant with keyboard navigation and screen reader support throughout.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA */}
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-secondary/50 border border-border rounded-lg p-12">
              <h2 className="mb-4">Start Tracking Today</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Create your first profile in under a minute. No registration required.
              </p>
              <Button size="lg" onClick={() => router.push('/children')} className="gap-2 px-8">
                Create Profile
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Dashboard for existing users
  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="mb-2">Dashboard</h1>
          {selectedChild && (
            <p className="text-muted-foreground">
              Tracking: {selectedChild.animalName}
            </p>
          )}
        </div>
        <Button onClick={() => router.push('/track')} className="gap-2">
          <Activity className="h-4 w-4" />
          Log Behavior
        </Button>
      </div>

      {!selectedChildId ? (
        <div className="text-center py-20 bg-secondary/30 rounded-lg">
          <Users className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
          <h2 className="mb-2">Select a Profile</h2>
          <p className="text-muted-foreground mb-10">
            Choose a profile to view behavior data
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {activeChildren.map((child) => (
              <Card
                key={child.id}
                className="cursor-pointer border-2 transition-premium hover:shadow-premium-hover hover:border-primary/30"
                onClick={() => selectChild(child.id)}
              >
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>{child.animalName}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Logged
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">{stats.total}</div>
                <p className="text-xs text-muted-foreground mt-1">All time</p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Today
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">{stats.today}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {format(new Date(), 'MMM d')}
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Last 7 Days
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">{stats.last7Days}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.avgPerDay.toFixed(1)} avg/day
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Most Common
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold capitalize">
                  {stats.mostCommonType?.replace('-', ' ') || 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Behavior type</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {recentIncidents.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="mb-4">No behaviors logged yet</p>
                  <Button variant="outline" onClick={() => router.push('/track')}>
                    Log First Behavior
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentIncidents.map((incident) => (
                    <div key={incident.id} className="flex items-start justify-between py-3 border-b last:border-0">
                      <div>
                        <p className="font-medium capitalize">
                          {incident.behaviorType.replace('-', ' ')}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {incident.behavior}
                        </p>
                      </div>
                      <time className="text-sm text-muted-foreground">
                        {format(new Date(incident.timestamp), 'MMM d, h:mm a')}
                      </time>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" onClick={() => router.push('/insights')}>
                    View All Insights
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Button
              variant="outline"
              className="h-32 border-2 transition-premium hover:shadow-premium"
              onClick={() => router.push('/track')}
            >
              <div className="flex flex-col items-center gap-3">
                <Activity className="h-6 w-6" />
                <span className="font-semibold">Log Behavior</span>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-32 border-2 transition-premium hover:shadow-premium"
              onClick={() => router.push('/insights')}
            >
              <div className="flex flex-col items-center gap-3">
                <BarChart3 className="h-6 w-6" />
                <span className="font-semibold">View Insights</span>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-32 border-2 transition-premium hover:shadow-premium"
              onClick={() => router.push('/export')}
            >
              <div className="flex flex-col items-center gap-3">
                <Download className="h-6 w-6" />
                <span className="font-semibold">Export Data</span>
              </div>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
