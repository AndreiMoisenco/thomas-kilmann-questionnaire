"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { questions, scoringMap } from "@/lib/questionnaire-data"

type Answer = "A" | "B" | null

const modeTranslations: Record<string, string> = {
  Competing: "Competiție",
  Collaborating: "Colaborare",
  Compromising: "Compromis",
  Avoiding: "Evitare",
  Accommodating: "Acomodare",
}

export default function QuestionnairePage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>(Array(30).fill(null))
  const [showResults, setShowResults] = useState(false)

  const handleAnswer = (answer: "A" | "B") => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answer
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < 29) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Calculate and show results
      setShowResults(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateResults = () => {
    const scores = {
      Competing: 0,
      Collaborating: 0,
      Compromising: 0,
      Avoiding: 0,
      Accommodating: 0,
    }

    answers.forEach((answer, index) => {
      if (answer) {
        const mode = scoringMap[index][answer]
        if (mode) {
          scores[mode]++
        }
      }
    })

    return scores
  }

  const progress = ((currentQuestion + 1) / 30) * 100

  if (showResults) {
    const results = calculateResults()
    const total = Object.values(results).reduce((sum, val) => sum + val, 0)

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <CardTitle className="text-3xl text-center">Rezultatele Chestionarului</CardTitle>
            <CardDescription className="text-center text-lg">
              Thomas-Kilmann - Moduri de Gestionare a Conflictelor
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {Object.entries(results).map(([mode, score]) => (
                <div key={mode} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">{modeTranslations[mode]}</span>
                    <span className="text-muted-foreground">
                      {score} / {total} ({total > 0 ? ((score / total) * 100).toFixed(1) : 0}%)
                    </span>
                  </div>
                  <Progress value={total > 0 ? (score / total) * 100 : 0} className="h-3" />
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-muted rounded-lg">
              <h3 className="font-semibold text-xl mb-3">Interpretarea Rezultatelor</h3>
              <div className="space-y-3 text-sm">
                <p>
                  <strong>Competiție:</strong> Stil asertiv și necooperant. Urmărești propriile obiective în detrimentul
                  altora.
                </p>
                <p>
                  <strong>Colaborare:</strong> Stil asertiv și cooperant. Încerci să găsești soluții care să satisfacă
                  ambele părți.
                </p>
                <p>
                  <strong>Compromis:</strong> Stil moderat în asertivitate și cooperare. Cauți soluții acceptabile
                  pentru ambele părți.
                </p>
                <p>
                  <strong>Evitare:</strong> Stil neasertiv și necooperant. Eviți conflictul sau amâni rezolvarea
                  problemei.
                </p>
                <p>
                  <strong>Acomodare:</strong> Stil neasertiv și cooperant. Neglijezi propriile nevoi pentru a satisface
                  pe celălalt.
                </p>
              </div>
            </div>

            <Button
              onClick={() => {
                setCurrentQuestion(0)
                setAnswers(Array(30).fill(null))
                setShowResults(false)
              }}
              className="w-full"
              size="lg"
            >
              Reîncepe Chestionarul
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="space-y-2">
            <CardTitle className="text-2xl">Chestionar Thomas-Kilmann - Moduri de Gestionare a Conflictelor</CardTitle>
            <CardDescription>Întrebarea {currentQuestion + 1} din 30</CardDescription>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <p className="text-lg leading-relaxed">{questions[currentQuestion].text}</p>

            <RadioGroup
              value={answers[currentQuestion] || ""}
              onValueChange={(value) => handleAnswer(value as "A" | "B")}
              className="space-y-4"
            >
              <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary transition-colors cursor-pointer">
                <RadioGroupItem value="A" id="option-a" className="mt-1" />
                <Label htmlFor="option-a" className="flex-1 cursor-pointer leading-relaxed">
                  <span className="font-semibold">A.</span> {questions[currentQuestion].optionA}
                </Label>
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary transition-colors cursor-pointer">
                <RadioGroupItem value="B" id="option-b" className="mt-1" />
                <Label htmlFor="option-b" className="flex-1 cursor-pointer leading-relaxed">
                  <span className="font-semibold">B.</span> {questions[currentQuestion].optionB}
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex justify-between gap-4 pt-4">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              variant="outline"
              size="lg"
              className="flex-1 bg-transparent"
            >
              ← Precedenta
            </Button>
            <Button onClick={handleNext} disabled={answers[currentQuestion] === null} size="lg" className="flex-1">
              {currentQuestion === 29 ? "Vezi Rezultatele" : "Următoarea →"}
            </Button>
          </div>

          {answers[currentQuestion] === null && (
            <p className="text-sm text-muted-foreground text-center">Selectează un răspuns pentru a continua</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
