import Papa from 'papaparse'
import type { BehaviorIncident } from '@/types/behavior'
import type { Child } from '@/types/child'
import { format } from 'date-fns'

export interface ExportOptions {
  startDate?: Date
  endDate?: Date
  useAnimalName?: boolean
  includeFullDetails?: boolean
}

export interface ExportData {
  // Basic fields (always included)
  Date: string
  Time: string
  'Child Name': string
  'Behavior Type': string
  Behavior: string

  // Optional detailed fields
  Antecedent?: string
  Consequence?: string
  'Duration (min)'?: string
  Intensity?: string
  Location?: string
  'People Present'?: string
  Notes?: string
  'Recorded By'?: string
  'Recorded At'?: string
}

/**
 * Exports behavior incidents to CSV format
 */
export function exportToCSV(
  incidents: BehaviorIncident[],
  child: Child,
  options: ExportOptions = {}
): string {
  const {
    startDate,
    endDate,
    useAnimalName = true,
    includeFullDetails = true,
  } = options

  // Filter by date range if provided
  let filteredIncidents = incidents

  if (startDate) {
    filteredIncidents = filteredIncidents.filter(
      (i) => new Date(i.timestamp) >= startDate
    )
  }

  if (endDate) {
    filteredIncidents = filteredIncidents.filter(
      (i) => new Date(i.timestamp) <= endDate
    )
  }

  // Sort by timestamp (oldest first)
  filteredIncidents.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  )

  // Transform data for export
  const exportData: ExportData[] = filteredIncidents.map((incident) => {
    const timestamp = new Date(incident.timestamp)
    const childName = useAnimalName ? child.animalName : '[Name Protected]'

    const baseData: ExportData = {
      Date: format(timestamp, 'yyyy-MM-dd'),
      Time: format(timestamp, 'HH:mm:ss'),
      'Child Name': childName,
      'Behavior Type': incident.behaviorType.replace('-', ' '),
      Behavior: incident.behavior,
    }

    if (includeFullDetails) {
      return {
        ...baseData,
        Antecedent: incident.antecedent,
        Consequence: incident.consequence,
        'Duration (min)': incident.duration ? incident.duration.toString() : '',
        Intensity: incident.intensity ? `${incident.intensity}/5` : '',
        Location: incident.location || '',
        'People Present': incident.people?.join(', ') || '',
        Notes: incident.notes || '',
        'Recorded By': incident.recordedBy || '',
        'Recorded At': format(new Date(incident.recordedAt), 'yyyy-MM-dd HH:mm:ss'),
      }
    }

    return baseData
  })

  // Generate CSV
  const csv = Papa.unparse(exportData, {
    header: true,
    quotes: true,
  })

  return csv
}

/**
 * Downloads CSV file
 */
export function downloadCSV(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}

/**
 * Shares CSV via Web Share API or email
 */
export async function shareCSV(csv: string, filename: string, child: Child): Promise<void> {
  const blob = new Blob([csv], { type: 'text/csv' })
  const file = new File([blob], filename, { type: 'text/csv' })

  // Try Web Share API first (mobile devices)
  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({
        title: `Behavior Data for ${child.animalName}`,
        text: `Behavior tracking data exported from Ash Behavior Tracker`,
        files: [file],
      })
      return
    } catch (error) {
      // User cancelled or error occurred, fall through to email
      console.log('Share cancelled or failed:', error)
    }
  }

  // Fallback to mailto link
  const subject = encodeURIComponent(`Behavior Data for ${child.animalName}`)
  const body = encodeURIComponent(
    `Please find attached the behavior tracking data for ${child.animalName}.\n\n` +
      `This data was exported from Ash Behavior Tracker.\n\n` +
      `Note: This email does not include the CSV file attachment. ` +
      `Please download the CSV file separately and attach it to your email.`
  )

  window.location.href = `mailto:?subject=${subject}&body=${body}`
}

/**
 * Generates a suggested filename for the export
 */
export function generateExportFilename(child: Child, startDate?: Date, endDate?: Date): string {
  const childName = child.animalName.replace(/\s+/g, '-')
  const timestamp = format(new Date(), 'yyyy-MM-dd')

  let dateRange = ''
  if (startDate && endDate) {
    dateRange = `_${format(startDate, 'yyyy-MM-dd')}_to_${format(endDate, 'yyyy-MM-dd')}`
  } else if (startDate) {
    dateRange = `_from_${format(startDate, 'yyyy-MM-dd')}`
  } else if (endDate) {
    dateRange = `_until_${format(endDate, 'yyyy-MM-dd')}`
  }

  return `ash-behavior-data_${childName}${dateRange}_${timestamp}.csv`
}

/**
 * Generates summary statistics for export preview
 */
export function generateExportSummary(incidents: BehaviorIncident[]): {
  totalIncidents: number
  dateRange: { start: string; end: string } | null
  behaviorTypes: Record<string, number>
} {
  if (incidents.length === 0) {
    return {
      totalIncidents: 0,
      dateRange: null,
      behaviorTypes: {},
    }
  }

  const timestamps = incidents.map((i) => new Date(i.timestamp).getTime())
  const start = new Date(Math.min(...timestamps))
  const end = new Date(Math.max(...timestamps))

  const behaviorTypes: Record<string, number> = {}
  incidents.forEach((incident) => {
    behaviorTypes[incident.behaviorType] = (behaviorTypes[incident.behaviorType] || 0) + 1
  })

  return {
    totalIncidents: incidents.length,
    dateRange: {
      start: format(start, 'MMM d, yyyy'),
      end: format(end, 'MMM d, yyyy'),
    },
    behaviorTypes,
  }
}
