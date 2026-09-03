import { Separator } from '@/components/ui/separator'
import './App.css'
import { Filings } from '@/components/Filings'

function App() {

  return (
    <div className="flex flex-col justify-center max-w-3xl">
      <div className="flex h-full items-center justify-center p-6">
        <h2 className="text-3xl font-semibold tracking-tight first:mt-0">Edgar Filings</h2>
      </div>
      <Separator />
      <Filings />
    </div>
  )
}

export default App
