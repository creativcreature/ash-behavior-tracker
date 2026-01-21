'use client'

import { useMemo, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'
import type { BehaviorIncident } from '@/types/behavior'
import { format, subDays, eachDayOfInterval, startOfDay } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart3, LineChart as LineChartIcon, Table } from 'lucide-react'

interface FrequencyChartProps {
  incidents: BehaviorIncident[]
  days?: 7 | 30 | 90
  title?: string
  description?: string
}

export function FrequencyChart({
  incidents,
  days = 7,
  title = 'Behavior Frequency',
  description = 'Number of behavior incidents over time',
}: FrequencyChartProps) {
  const [chartType, setChartType] = useState<'bar' | 'line' | 'table'>('bar')

  const chartData = useMemo(() => {
    const endDate = new Date()
    const startDate = subDays(endDate, days - 1)
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate })

    return dateRange.map((date) => {
      const dayStart = startOfDay(date)
      const dayEnd = new Date(dayStart)
      dayEnd.setHours(23, 59, 59, 999)

      const count = incidents.filter((incident) => {
        const incidentDate = new Date(incident.timestamp)
        return incidentDate >= dayStart && incidentDate <= dayEnd
      }).length

      return {
        date: format(date, 'MMM d'),
        fullDate: format(date, 'yyyy-MM-dd'),
        count,
      }
    })
  }, [incidents, days])

  const total = chartData.reduce((sum, day) => sum + day.count, 0)
  const average = (total / days).toFixed(1)
  const peak = Math.max(...chartData.map((d) => d.count))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant={chartType === 'bar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('bar')}
              aria-label="View as bar chart"
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
            <Button
              variant={chartType === 'line' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('line')}
              aria-label="View as line chart"
            >
              <LineChartIcon className="h-4 w-4" />
            </Button>
            <Button
              variant={chartType === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('table')}
              aria-label="View as table"
            >
              <Table className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex gap-6 mt-4 text-sm">
          <div>
            <p className="text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">{total}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Average/Day</p>
            <p className="text-2xl font-bold">{average}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Peak</p>
            <p className="text-2xl font-bold">{peak}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartType === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">Date</th>
                  <th className="text-right py-2 px-4">Count</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((day, index) => (
                  <tr key={index} className="border-b last:border-0">
                    <td className="py-2 px-4">{day.date}</td>
                    <td className="text-right py-2 px-4 font-semibold">{day.count}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t font-semibold">
                  <td className="py-2 px-4">Total</td>
                  <td className="text-right py-2 px-4">{total}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            {chartType === 'bar' ? (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
