import { QuestionTracker } from "@/components/question-tracker"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Question Tracker</h1>
          <ThemeToggle />
        </div>
        <QuestionTracker />
      </div>
    </div>
  )
}
