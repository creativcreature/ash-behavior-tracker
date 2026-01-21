'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useChildrenStore } from '@/store/childrenStore'
import { useBehaviorsStore } from '@/store/behaviorsStore'
import { FrequencyChart } from '@/components/reports/FrequencyChart'
import { BehaviorBreakdown } from '@/components/reports/BehaviorBreakdown'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  BarChart3,
  AlertCircle,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'
import { subDays } from 'date-fns'

type DateRange = '7' | '30' | '90'

export default function InsightsPage() {
  const router = useRouter()
  const { selectedChildId, children, fetchChildren } = useChildrenStore()
  const { incidents, fetchIncidents } = useBehaviorsStore()
  const [dateRange, setDateRange] = useState<DateRange>('7')

  useEffect(() => {
    fetchChildren()
    fetchIncidents()
  }, [fetchChildren, fetchIncidents])

  const selectedChild = children.find((c) => c.id === selectedChildId)

  const filteredIncidents = useMemo(() => {
    if (!selectedChildId) return []

    const days = parseInt(dateRange)
    const cutoffDate = subDays(new Date(), days)

    return incidents.filter(
      (incident) =>
        incident.childId === selectedChildId &&
        new Date(incident.timestamp) >= cutoffDate
    )
  }, [selectedChildId, incidents, dateRange])

  const timeOfDayStats = useMemo(() => {
    const morning = { label: 'Morning (6am-12pm)', count: 0 }
    const afternoon = { label: 'Afternoon (12pm-6pm)', count: 0 }
    const evening = { label: 'Evening (6pm-12am)', count: 0 }
    const night = { label: 'Night (12am-6am)', count: 0 }

    filteredIncidents.forEach((incident) => {
      const hour = new Date(incident.timestamp).getHours()
      if (hour >= 6 && hour < 12) morning.count++
      else if (hour >= 12 && hour < 18) afternoon.count++
      else if (hour >= 18 || hour < 0) evening.count++
      else night.count++
    })

    return [morning, afternoon, evening, night].filter((period) => period.count > 0)
  }, [filteredIncidents])

  const commonTriggers = useMemo(() => {
    const triggers: Record<string, number> = {}

    filteredIncidents.forEach((incident) => {
      if (incident.antecedent && incident.antecedent !== 'Not specified') {
        triggers[incident.antecedent] = (triggers[incident.antecedent] || 0) + 1
      }
    })

    return Object.entries(triggers)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([trigger, count]) => ({ trigger, count }))
  }, [filteredIncidents])

  const trend = useMemo(() => {
    if (filteredIncidents.length < 2) return null

    const days = parseInt(dateRange)
    const midpoint = Math.floor(days / 2)
    const cutoffDate = subDays(new Date(), midpoint)

    const recentCount = filteredIncidents.filter(
      (i) => new Date(i.timestamp) >= cutoffDate
    ).length

    const olderCount = filteredIncidents.length - recentCount

    const recentAvg = recentCount / midpoint
    const olderAvg = olderCount / (days - midpoint)

    const change = ((recentAvg - olderAvg) / olderAvg) * 100

    return {
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
      percentage: Math.abs(change).toFixed(1),
    }
  }, [filteredIncidents, dateRange])

  if (!selectedChildId || !selectedChild) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center py-12 bg-muted/50 rounded-lg">
          <AlertCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Child Profile Selected</h2>
          <p className="text-muted-foreground mb-6">
            Please select a child profile to view insights
          </p>
          <Button onClick={() => router.push('/')}>Go to Dashboard</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BarChart3 className="h-8 w-8" />
            Behavior Insights
          </h1>
          <p className="text-muted-foreground mt-2 flex items-center gap-2">
            <span>{selectedChild.animalEmoji}</span>
            Analysis for {selectedChild.animalName}
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={dateRange} onValueChange={(value) => setDateRange(value as DateRange)}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="90">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => router.push('/export')}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {filteredIncidents.length === 0 ? (
        <div className="text-center py-12 bg-muted/50 rounded-lg">
          <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Data Available</h2>
          <p className="text-muted-foreground mb-6">
            No behavior incidents logged in the selected time period
          </p>
          <Button onClick={() => router.push('/track')}>Log Behavior</Button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Trend Indicator */}
          {trend && trend.direction !== 'stable' && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  {trend.direction === 'up' ? (
                    <TrendingUp className="h-8 w-8 text-destructive" />
                  ) : (
                    <TrendingDown className="h-8 w-8 text-green-600" />
                  )}
                  <div>
                    <p className="text-lg font-semibold">
                      Behaviors are trending {trend.direction}
                    </p>
                    <p className="text-muted-foreground">
                      {trend.percentage}% {trend.direction === 'up' ? 'increase' : 'decrease'} in
                      recent days compared to earlier in the period
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Frequency Chart */}
          <FrequencyChart
            incidents={filteredIncidents}
            days={parseInt(dateRange) as 7 | 30 | 90}
            title="Behavior Frequency Over Time"
            description={`Daily behavior count for the last ${dateRange} days`}
          />

          {/* Behavior Type Breakdown */}
          <BehaviorBreakdown incidents={filteredIncidents} />

          {/* Additional Insights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Time of Day */}
            <Card>
              <CardHeader>
                <CardTitle>Time of Day Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                {timeOfDayStats.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No data available</p>
                ) : (
                  <div className="space-y-4">
                    {timeOfDayStats.map((period, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">{period.label}</span>
                          <span className="text-sm font-bold">{period.count}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{
                              width: `${(period.count / filteredIncidents.length) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Common Triggers */}
            <Card>
              <CardHeader>
                <CardTitle>Common Triggers</CardTitle>
              </CardHeader>
              <CardContent>
                {commonTriggers.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No triggers recorded yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {commonTriggers.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <p className="text-sm flex-1">{item.trigger}</p>
                        <span className="text-lg font-bold ml-4">{item.count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
