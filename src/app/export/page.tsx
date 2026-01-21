'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useChildrenStore } from '@/store/childrenStore'
import { useBehaviorsStore } from '@/store/behaviorsStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AlertCircle, Download, Share2, FileDown, CheckCircle2 } from 'lucide-react'
import {
  exportToCSV,
  downloadCSV,
  shareCSV,
  generateExportFilename,
  generateExportSummary,
} from '@/lib/utils/export'
import { subDays } from 'date-fns'

export default function ExportPage() {
  const router = useRouter()
  const { selectedChildId, children, fetchChildren } = useChildrenStore()
  const { incidents, fetchIncidents } = useBehaviorsStore()

  const [dateRange, setDateRange] = useState<'all' | '7' | '30' | '90' | 'custom'>('30')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [useAnimalName, setUseAnimalName] = useState(true)
  const [includeFullDetails, setIncludeFullDetails] = useState(true)
  const [exportSuccess, setExportSuccess] = useState(false)

  useEffect(() => {
    fetchChildren()
    fetchIncidents()
  }, [fetchChildren, fetchIncidents])

  const selectedChild = children.find((c) => c.id === selectedChildId)

  const filteredIncidents = useMemo(() => {
    if (!selectedChildId) return []

    let filtered = incidents.filter((i) => i.childId === selectedChildId)

    if (dateRange !== 'all' && dateRange !== 'custom') {
      const days = parseInt(dateRange)
      const cutoffDate = subDays(new Date(), days)
      filtered = filtered.filter((i) => new Date(i.timestamp) >= cutoffDate)
    }

    if (dateRange === 'custom') {
      if (startDate) {
        filtered = filtered.filter((i) => new Date(i.timestamp) >= new Date(startDate))
      }
      if (endDate) {
        const endDateTime = new Date(endDate)
        endDateTime.setHours(23, 59, 59, 999)
        filtered = filtered.filter((i) => new Date(i.timestamp) <= endDateTime)
      }
    }

    return filtered
  }, [selectedChildId, incidents, dateRange, startDate, endDate])

  const summary = useMemo(
    () => generateExportSummary(filteredIncidents),
    [filteredIncidents]
  )

  const handleDownload = () => {
    if (!selectedChild) return

    const csv = exportToCSV(filteredIncidents, selectedChild, {
      useAnimalName,
      includeFullDetails,
    })

    const filename = generateExportFilename(
      selectedChild,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    )

    downloadCSV(csv, filename)
    setExportSuccess(true)
    setTimeout(() => setExportSuccess(false), 3000)
  }

  const handleShare = async () => {
    if (!selectedChild) return

    const csv = exportToCSV(filteredIncidents, selectedChild, {
      useAnimalName,
      includeFullDetails,
    })

    const filename = generateExportFilename(
      selectedChild,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    )

    await shareCSV(csv, filename, selectedChild)
  }

  if (!selectedChildId || !selectedChild) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center py-12 bg-muted/50 rounded-lg">
          <AlertCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Child Profile Selected</h2>
          <p className="text-muted-foreground mb-6">
            Please select a child profile to export data
          </p>
          <Button onClick={() => router.push('/')}>Go to Dashboard</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <FileDown className="h-8 w-8" />
          Export Data
        </h1>
        <p className="text-muted-foreground mt-2 flex items-center gap-2">
          <span>{selectedChild.animalEmoji}</span>
          Export behavior data for {selectedChild.animalName}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Export Options */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Export Options</CardTitle>
              <CardDescription>
                Configure your data export settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Date Range */}
              <div className="space-y-2">
                <Label>Date Range</Label>
                <Select value={dateRange} onValueChange={(v: any) => setDateRange(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="7">Last 7 Days</SelectItem>
                    <SelectItem value="30">Last 30 Days</SelectItem>
                    <SelectItem value="90">Last 90 Days</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Date Range */}
              {dateRange === 'custom' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date">End Date</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Privacy Options */}
              <div className="space-y-3">
                <Label>Privacy</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="use-animal-name"
                    checked={useAnimalName}
                    onChange={(e) => setUseAnimalName(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <label htmlFor="use-animal-name" className="text-sm">
                    Use animal name ({selectedChild.animalName})
                  </label>
                </div>
                <p className="text-xs text-muted-foreground">
                  When unchecked, "[Name Protected]" will be used instead
                </p>
              </div>

              {/* Detail Level */}
              <div className="space-y-3">
                <Label>Detail Level</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="full-details"
                    checked={includeFullDetails}
                    onChange={(e) => setIncludeFullDetails(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <label htmlFor="full-details" className="text-sm">
                    Include full ABC data and metadata
                  </label>
                </div>
                <p className="text-xs text-muted-foreground">
                  When unchecked, only basic information will be exported
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Export Preview</CardTitle>
              <CardDescription>
                Review what will be included in your export
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredIncidents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No data matches the selected criteria</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Incidents</p>
                      <p className="text-2xl font-bold">{summary.totalIncidents}</p>
                    </div>
                    {summary.dateRange && (
                      <div>
                        <p className="text-sm text-muted-foreground">Date Range</p>
                        <p className="text-sm font-medium">
                          {summary.dateRange.start} - {summary.dateRange.end}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Behavior Types</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(summary.behaviorTypes).map(([type, count]) => (
                        <span
                          key={type}
                          className="text-xs bg-secondary px-3 py-1 rounded-full"
                        >
                          {type.replace('-', ' ')}: {count}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm text-muted-foreground mb-2">Included Fields</p>
                    <div className="text-sm space-y-1">
                      <p>✓ Date & Time</p>
                      <p>✓ Child Name</p>
                      <p>✓ Behavior Type & Description</p>
                      {includeFullDetails && (
                        <>
                          <p>✓ Antecedent & Consequence</p>
                          <p>✓ Duration & Intensity</p>
                          <p>✓ Location & People Present</p>
                          <p>✓ Notes & Recording Details</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Export Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Export Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={handleDownload}
                disabled={filteredIncidents.length === 0}
                className="w-full"
                size="lg"
              >
                <Download className="h-5 w-5 mr-2" />
                Download CSV
              </Button>

              <Button
                onClick={handleShare}
                disabled={filteredIncidents.length === 0}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <Share2 className="h-5 w-5 mr-2" />
                Share via Email
              </Button>

              {exportSuccess && (
                <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Export successful!</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About CSV Export</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2 text-muted-foreground">
              <p>
                CSV files can be opened in Excel, Google Sheets, or imported into BCBA
                software.
              </p>
              <p>
                All data is generated locally in your browser. Nothing is sent to external
                servers.
              </p>
              <p className="font-medium text-foreground">
                ⚠️ Please handle exported files according to HIPAA and privacy guidelines.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
