"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

type DailyRecord = {
  date: string // YYYY-MM-DD format
  completed: number
}

export function QuestionTracker() {
  const [records, setRecords] = useState<DailyRecord[]>([])
  const [extraQuestions, setExtraQuestions] = useState(0)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [questionsToday, setQuestionsToday] = useState(0)

  // Constants
  const dailyTarget = 7
  const daysInChallenge = 30
  const totalTarget = dailyTarget * daysInChallenge

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedRecords = localStorage.getItem("questionRecords")
    const savedExtra = localStorage.getItem("extraQuestions")

    if (savedRecords) {
      setRecords(JSON.parse(savedRecords))
    }

    if (savedExtra) {
      setExtraQuestions(Number.parseInt(savedExtra))
    }
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("questionRecords", JSON.stringify(records))
  }, [records])

  useEffect(() => {
    localStorage.setItem("extraQuestions", extraQuestions.toString())
  }, [extraQuestions])

  // Update questions for selected date
  useEffect(() => {
    const dateString = selectedDate.toISOString().split("T")[0]
    const record = records.find((r) => r.date === dateString)
    setQuestionsToday(record?.completed || 0)
  }, [selectedDate, records])

  // Calculate total completed questions
  const totalCompleted = records.reduce((sum, record) => sum + record.completed, 0)

  // Calculate remaining questions
  const remainingQuestions = Math.max(0, totalTarget - totalCompleted - extraQuestions)

  // Calculate progress percentage
  const progressPercentage = Math.min(100, ((totalCompleted + extraQuestions) / totalTarget) * 100)

  // Get today's date string
  const today = new Date()
  const todayString = today.toISOString().split("T")[0]

  // Generate June 2025 calendar days
  const generateJuneDays = () => {
    const days = []
    const year = 2025
    const month = 5 // June (0-indexed)

    // Get first day of June and number of days
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    // Add empty cells for days before June starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of June
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      days.push(date)
    }

    return days
  }

  const juneDays = generateJuneDays()

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // Get questions completed for a specific date
  const getQuestionsForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    const record = records.find((r) => r.date === dateString)
    return record?.completed || 0
  }

  // Save questions for the selected date
  const saveQuestions = () => {
    const dateString = selectedDate.toISOString().split("T")[0]
    const existingRecordIndex = records.findIndex((r) => r.date === dateString)

    if (existingRecordIndex >= 0) {
      const newRecords = [...records]
      newRecords[existingRecordIndex] = {
        ...newRecords[existingRecordIndex],
        completed: questionsToday,
      }
      setRecords(newRecords)
    } else {
      setRecords([...records, { date: dateString, completed: questionsToday }])
    }
  }

  // Handle extra questions
  const saveExtraQuestions = (value: number) => {
    setExtraQuestions(value)
  }

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>June Challenge Progress</CardTitle>
          <CardDescription>Track your 7 daily questions for 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2 text-sm">
                <span>Progress: {Math.round(progressPercentage)}%</span>
                <span>
                  {totalCompleted + extraQuestions} / {totalTarget}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div>
                <Label>Remaining Questions</Label>
                <div className="text-2xl font-bold mt-1">{remainingQuestions}</div>
              </div>

              <div>
                <Label htmlFor="extra">Extra Questions</Label>
                <Input
                  id="extra"
                  type="number"
                  min="0"
                  value={extraQuestions}
                  onChange={(e) => saveExtraQuestions(Number.parseInt(e.target.value) || 0)}
                  className="h-9 mt-1"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>June 2025 Calendar</CardTitle>
          <CardDescription>Click on any date to log questions</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Calendar Grid */}
          <div className="space-y-4">
            {/* Week day headers */}
            <div className="grid grid-cols-7 gap-1">
              {weekDays.map((day) => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {juneDays.map((date, index) => {
                if (!date) {
                  return <div key={index} className="h-12" />
                }

                const dateString = date.toISOString().split("T")[0]
                const questionsCompleted = getQuestionsForDate(date)
                const isSelected = selectedDate.toISOString().split("T")[0] === dateString
                const isToday = dateString === todayString
                const isComplete = questionsCompleted >= dailyTarget

                return (
                  <button
                    key={dateString}
                    onClick={() => setSelectedDate(date)}
                    className={`
                      h-12 rounded-md border text-sm font-medium transition-colors
                      hover:bg-accent hover:text-accent-foreground
                      ${isSelected ? "bg-primary text-primary-foreground" : ""}
                      ${isToday && !isSelected ? "bg-accent border-primary" : ""}
                      ${isComplete && !isSelected ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800" : ""}
                    `}
                  >
                    <div className="flex flex-col items-center justify-center h-full">
                      <span>{date.getDate()}</span>
                      {questionsCompleted > 0 && <span className="text-xs opacity-75">{questionsCompleted}</span>}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{formatDate(selectedDate)}</span>
            {selectedDate.toISOString().split("T")[0] === todayString && <Badge variant="secondary">Today</Badge>}
          </CardTitle>
          <CardDescription>Log questions completed on this day</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="questions">Questions Completed</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  id="questions"
                  type="number"
                  min="0"
                  value={questionsToday}
                  onChange={(e) => setQuestionsToday(Number.parseInt(e.target.value) || 0)}
                  className="h-9"
                  placeholder="Enter number of questions"
                />
                <Button onClick={saveQuestions}>Save</Button>
              </div>
            </div>

            {questionsToday >= dailyTarget && (
              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                Daily target achieved!
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
