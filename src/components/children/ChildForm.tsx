'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import type { CreateChildInput, UpdateChildInput, AgeRange } from '@/types/child'
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

const childFormSchema = z.object({
  dateOfBirth: z.string().optional(),
  ageRange: z.enum(['toddler', 'preschool', 'school-age', 'teen', 'adult']).optional(),
  diagnosis: z.string().optional(),
  notes: z.string().optional(),
})

type ChildFormValues = z.infer<typeof childFormSchema>

interface ChildFormProps {
  initialData?: UpdateChildInput
  onSubmit: (data: CreateChildInput | UpdateChildInput) => Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}

export function ChildForm({ initialData, onSubmit, onCancel, isLoading }: ChildFormProps) {
  const [diagnosisInput, setDiagnosisInput] = useState(
    initialData?.diagnosis?.join(', ') || ''
  )

  const form = useForm<ChildFormValues>({
    resolver: zodResolver(childFormSchema),
    defaultValues: {
      dateOfBirth: initialData?.dateOfBirth || '',
      ageRange: initialData?.ageRange,
      diagnosis: initialData?.diagnosis?.join(', ') || '',
      notes: initialData?.notes || '',
    },
  })

  const handleSubmit = async (values: ChildFormValues) => {
    const data: CreateChildInput = {
      ...values,
      diagnosis: values.diagnosis
        ? values.diagnosis.split(',').map((d) => d.trim()).filter(Boolean)
        : undefined,
    }

    await onSubmit(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="ageRange"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age Range</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an age range" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="toddler">Toddler (1-3 years)</SelectItem>
                  <SelectItem value="preschool">Preschool (3-5 years)</SelectItem>
                  <SelectItem value="school-age">School Age (5-12 years)</SelectItem>
                  <SelectItem value="teen">Teen (13-17 years)</SelectItem>
                  <SelectItem value="adult">Adult (18+ years)</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Select the age range that best fits
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth (Optional)</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormDescription>
                This information is optional and stored locally
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="diagnosis"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diagnosis (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Autism, ADHD, Anxiety"
                  {...field}
                  value={diagnosisInput}
                  onChange={(e) => {
                    setDiagnosisInput(e.target.value)
                    field.onChange(e.target.value)
                  }}
                />
              </FormControl>
              <FormDescription>
                Separate multiple diagnoses with commas
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
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any additional information..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Add any relevant information
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : initialData ? 'Update Profile' : 'Create Profile'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
