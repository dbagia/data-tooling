import { useState, useEffect, type SubmitEvent } from 'react'
import { Input } from './ui/input'
import { Label } from './ui/label'

interface FormFilterProps {
  formFilter?: string
  onFilterChange: (formFilter: string) => void
}

export function FormFilter({ formFilter, onFilterChange }: FormFilterProps) {
  const [value, setValue] = useState(formFilter)

  // Keep the input field value in sync with ticker query param
  useEffect(() => {
    setValue(formFilter)
  }, [formFilter])

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    onFilterChange(value || "")
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-row justify-end items-center py-5 gap-2">
        <Label htmlFor="formFilter">Form filter: </Label>
        <Input id="formFilter" className="w-4xs" value={value} onChange={(e) => setValue(e.target.value)} />
      </div>
    </form>
  )
}
