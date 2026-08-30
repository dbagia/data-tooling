import { useState } from 'react'
import { Separator } from '@/components/ui/separator'
import './App.css'

function App() {
  const [message] = useState('')
  return (
    <div className="flex flex-col justify-center max-w-3xl">
      <div className="flex h-full items-center justify-center p-6">
        <h2 className="text-3xl font-semibold tracking-tight first:mt-0">Get shipping offers</h2>
      </div>
      <Separator />
      {message && <div className="text-lg text-center text-muted-foreground p-6 text-red-400">{message}</div>}
    </div>
  )
}

export default App
