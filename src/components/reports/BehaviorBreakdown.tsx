'use client'

import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { BehaviorIncident } from '@/types/behavior'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface BehaviorBreakdownProps {
  incidents: BehaviorIncident[]
  title?: string
  description?: string
}

const COLORS = {
  aggression: '#ef4444',
  'self-injury': '#f97316',
  elopement: '#eab308',
  'property-destruction': '#8b5cf6',
  'tantrum-meltdown': '#3b82f6',
  other: '#6b7280',
}

const ICONS: Record<string, string> = {
  aggression: '👊',
  'self-injury': '✋',
  elopement: '🏃',
  'property-destruction': '💥',
  'tantrum-meltdown': '😭',
  other: '📝',
}

export function BehaviorBreakdown({
  incidents,
  title = 'Behavior Type Breakdown',
  description = 'Distribution of behavior types',
}: BehaviorBreakdownProps) {
  const chartData = useMemo(() => {
    const typeCounts: Record<string, number> = {}

    incidents.forEach((incident) => {
      typeCounts[incident.behaviorType] = (typeCounts[incident.behaviorType] || 0) + 1
    })

    return Object.entries(typeCounts)
      .map(([type, count]) => ({
        type: type.replace('-', ' '),
        rawType: type,
        count,
        percentage: ((count / incidents.length) * 100).toFixed(1),
        icon: ICONS[type] || '📝',
      }))
      .sort((a, b) => b.count - a.count)
  }, [incidents])

  if (incidents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" allowDecimals={false} />
            <YAxis
              type="category"
              dataKey="type"
              width={150}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
              formatter={(value: number, name: string, props: any) => [
                `${value} (${props.payload.percentage}%)`,
                'Count',
              ]}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.rawType as keyof typeof COLORS]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {chartData.map((item) => (
            <div
              key={item.rawType}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="font-medium capitalize">{item.type}</p>
                  <p className="text-sm text-muted-foreground">{item.percentage}%</p>
                </div>
              </div>
              <div className="text-2xl font-bold">{item.count}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
