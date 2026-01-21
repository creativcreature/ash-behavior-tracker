'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import type { BehaviorType, CreateBehaviorInput, IntensityLevel } from '@/types/behavior'
import { useBehaviorsStore } from '@/store/behaviorsStore'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ChevronDown, ChevronUp } from 'lucide-react'

const behaviorFormSchema = z.object({
  behaviorType: z.enum([
    'aggression',
    'self-injury',
    'elopement',
    'property-destruction',
    'tantrum-meltdown',
    'other',
  ]),
  behavior: z.string().min(1, 'Behavior description is required'),
  antecedent: z.string().optional(),
  consequence: z.string().optional(),
  timestamp: z.string().optional(),
  intensity: z.number().min(1).max(5).optional(),
  duration: z.number().min(0).optional(),
  location: z.string().optional(),
  people: z.string().optional(),
  notes: z.string().optional(),
})

type BehaviorFormValues = z.infer<typeof behaviorFormSchema>

interface ABCEntryFormProps {
  childId: string
  initialBehaviorType?: BehaviorType
  onSuccess?: () => void
  onCancel?: () => void
}

export function ABCEntryForm({
  childId,
  initialBehaviorType,
  onSuccess,
  onCancel,
}: ABCEntryFormProps) {
  const [isFullMode, setIsFullMode] = useState(false)
  const { createIncident, templates, fetchTemplates } = useBehaviorsStore()

  useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  const currentTemplate = templates.find(
    (t) => t.behaviorType === initialBehaviorType
  )

  const form = useForm<BehaviorFormValues>({
    resolver: zodResolver(behaviorFormSchema),
    defaultValues: {
      behaviorType: initialBehaviorType || 'aggression',
      behavior: '',
      antecedent: '',
      consequence: '',
      timestamp: new Date().toISOString().slice(0, 16),
      intensity: undefined,
      duration: undefined,
      location: '',
      people: '',
      notes: '',
    },
  })

  const handleSubmit = async (values: BehaviorFormValues) => {
    const data: CreateBehaviorInput = {
      childId,
      behaviorType: values.behaviorType,
      behavior: values.behavior,
      antecedent: values.antecedent || 'Not specified',
      consequence: values.consequence || 'Not specified',
      timestamp: values.timestamp,
      intensity: values.intensity as IntensityLevel | undefined,
      duration: values.duration,
      location: values.location,
      people: values.people ? values.people.split(',').map((p) => p.trim()) : undefined,
      notes: values.notes,
    }

    await createIncident(data)
    form.reset()
    onSuccess?.()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">
          {isFullMode ? 'Full ABC Data Entry' : 'Quick Behavior Entry'}
        </h2>
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsFullMode(!isFullMode)}
        >
          {isFullMode ? (
            <>
              <ChevronUp className="h-4 w-4 mr-2" />
              Quick Mode
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-2" />
              Full ABC Mode
            </>
          )}
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="behaviorType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Behavior Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="aggression">👊 Aggression</SelectItem>
                    <SelectItem value="self-injury">✋ Self-Injury</SelectItem>
                    <SelectItem value="elopement">🏃 Elopement</SelectItem>
                    <SelectItem value="property-destruction">
                      💥 Property Destruction
                    </SelectItem>
                    <SelectItem value="tantrum-meltdown">
                      😭 Tantrum/Meltdown
                    </SelectItem>
                    <SelectItem value="other">📝 Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="behavior"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Behavior Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe what happened..."
                    className="min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Brief description of the behavior that occurred
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="timestamp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time of Incident</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormDescription>
                  When did this behavior occur?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {isFullMode && (
            <>
              <FormField
                control={form.control}
                name="antecedent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Antecedent (What happened before)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select or type custom..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {currentTemplate?.commonAntecedents.map((antecedent) => (
                          <SelectItem key={antecedent} value={antecedent}>
                            {antecedent}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormControl>
                      <Input
                        placeholder="Or type custom antecedent..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      What triggered this behavior?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="consequence"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Consequence (What happened after)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select or type custom..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {currentTemplate?.commonConsequences.map((consequence) => (
                          <SelectItem key={consequence} value={consequence}>
                            {consequence}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormControl>
                      <Input
                        placeholder="Or type custom consequence..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      How was the behavior addressed?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="intensity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Intensity (1-5)</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select intensity" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1 - Very Mild</SelectItem>
                          <SelectItem value="2">2 - Mild</SelectItem>
                          <SelectItem value="3">3 - Moderate</SelectItem>
                          <SelectItem value="4">4 - Severe</SelectItem>
                          <SelectItem value="5">5 - Very Severe</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Classroom, Home, Playground" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="people"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>People Present (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Parent, Teacher, Therapist"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Separate multiple people with commas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any other relevant information..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" size="lg">
              Save Behavior Log
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
