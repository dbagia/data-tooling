import { useState, useEffect, type SubmitEvent } from 'react'
import { Button } from './ui/button'
import { Field, FieldGroup } from './ui/field'
import { Input } from './ui/input'

interface FilingsFormProps {
  ticker: string
  onTickerChange: (ticker: string) => void
}

export function FilingsForm({ ticker, onTickerChange }: FilingsFormProps) {
  const [value, setValue] = useState(ticker)

  // Keep the input field value in sync with ticker query param
  useEffect(() => {
    setValue(ticker)
  }, [ticker])

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    onTickerChange(value)
  }

  return (
    <div className="p-6">
    <form onSubmit={handleSubmit}>
      <FieldGroup className="flex flex-row justify-center">
        <Field className="size-14 grow-12">
          <Input
            id="ticker"
            placeholder="AAPL"
            required
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </Field>
        <Field className="size-14 grow-2">
          <Button type="submit">Search</Button>
        </Field>
      </FieldGroup>
    </form>
    </div>
  )
}
