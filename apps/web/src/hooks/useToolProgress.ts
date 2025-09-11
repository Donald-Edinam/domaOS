"use client"

import { useState, useCallback } from "react"
import type { ToolStep } from "@/components/ui/tool-progress"

export function useToolProgress() {
  const [steps, setSteps] = useState<ToolStep[]>([])
  const [currentStep, setCurrentStep] = useState<string | undefined>()

  const addStep = useCallback((step: Omit<ToolStep, "status">) => {
    const newStep: ToolStep = {
      ...step,
      status: "pending",
    }
    setSteps(prev => [...prev, newStep])
    return newStep.id
  }, [])

  const startStep = useCallback((stepId: string) => {
    setSteps(prev => prev.map(step =>
      step.id === stepId
        ? { ...step, status: "running" as const, startTime: new Date() }
        : step
    ))
    setCurrentStep(stepId)
  }, [])

  const completeStep = useCallback((stepId: string, output?: unknown) => {
    setSteps(prev => prev.map(step =>
      step.id === stepId
        ? {
            ...step,
            status: "completed" as const,
            endTime: new Date(),
            output
          }
        : step
    ))
    setCurrentStep(undefined)
  }, [])

  const failStep = useCallback((stepId: string, error: string) => {
    setSteps(prev => prev.map(step =>
      step.id === stepId
        ? {
            ...step,
            status: "error" as const,
            endTime: new Date(),
            error
          }
        : step
    ))
    setCurrentStep(undefined)
  }, [])

  const resetSteps = useCallback(() => {
    setSteps([])
    setCurrentStep(undefined)
  }, [])

  const updateStepInput = useCallback((stepId: string, input: Record<string, unknown>) => {
    setSteps(prev => prev.map(step =>
      step.id === stepId ? { ...step, input } : step
    ))
  }, [])

  return {
    steps,
    currentStep,
    addStep,
    startStep,
    completeStep,
    failStep,
    resetSteps,
    updateStepInput,
  }
}
