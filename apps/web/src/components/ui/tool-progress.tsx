"use client";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { DomaScrollbars } from "./overlay-scrollbars";
import {
  CheckCircle,
  ChevronDown,
  Loader2,
  Search,
  Database,
  BarChart,
  Globe,
  XCircle,
  Clock,
} from "lucide-react";
import { useState } from "react";

export type ToolStep = {
  id: string;
  name: string;
  description: string;
  status: "pending" | "running" | "completed" | "error";
  startTime?: Date;
  endTime?: Date;
  input?: Record<string, unknown>;
  output?: unknown;
  error?: string;
};

export type ToolProgressProps = {
  steps: ToolStep[];
  currentStep?: string;
  className?: string;
  defaultOpen?: boolean;
};

const getToolIcon = (toolName: string) => {
  switch (toolName) {
    case "search-doma-names":
      return <Search className="h-4 w-4" />;
    case "get-doma-name-details":
      return <Database className="h-4 w-4" />;
    case "get-doma-listings":
      return <BarChart className="h-4 w-4" />;
    case "get-doma-offers":
      return <BarChart className="h-4 w-4" />;
    case "get-doma-name-activities":
      return <Clock className="h-4 w-4" />;
    case "get-doma-name-statistics":
      return <BarChart className="h-4 w-4" />;
    default:
      return <Globe className="h-4 w-4" />;
  }
};

const getStepIcon = (status: ToolStep["status"]) => {
  switch (status) {
    case "pending":
      return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />;
    case "running":
      return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    case "completed":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "error":
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />;
  }
};

const getStatusBadge = (status: ToolStep["status"]) => {
  const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
  switch (status) {
    case "pending":
      return (
        <span
          className={cn(
            baseClasses,
            "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
          )}
        >
          Pending
        </span>
      );
    case "running":
      return (
        <span
          className={cn(
            baseClasses,
            "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
          )}
        >
          Running
        </span>
      );
    case "completed":
      return (
        <span
          className={cn(
            baseClasses,
            "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
          )}
        >
          Completed
        </span>
      );
    case "error":
      return (
        <span
          className={cn(
            baseClasses,
            "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
          )}
        >
          Error
        </span>
      );
    default:
      return null;
  }
};

const formatDuration = (start?: Date, end?: Date) => {
  if (!start) return null;
  const endTime = end || new Date();
  const duration = endTime.getTime() - start.getTime();
  return `${duration}ms`;
};

const formatValue = (value: unknown): string => {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }
  return String(value);
};

const ToolProgress = ({
  steps,
  currentStep,
  className,
  defaultOpen = true,
}: ToolProgressProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const activeSteps = steps.filter(
    (step) => step.status !== "pending" || step.id === currentStep,
  );
  const hasError = steps.some((step) => step.status === "error");
  const allCompleted =
    steps.length > 0 && steps.every((step) => step.status === "completed");
  const isRunning = steps.some((step) => step.status === "running");

  if (activeSteps.length === 0) return null;

  return (
    <div
      className={cn(
        "border rounded-lg overflow-hidden bg-background",
        className,
      )}
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between rounded-b-none px-4 py-3 h-auto font-normal"
          >
            <div className="flex items-center gap-3">
              {isRunning ? (
                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
              ) : allCompleted ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : hasError ? (
                <XCircle className="h-4 w-4 text-red-500" />
              ) : (
                <Clock className="h-4 w-4 text-gray-500" />
              )}
              <div className="text-left">
                <div className="font-medium text-sm">
                  {isRunning
                    ? "AI is working..."
                    : allCompleted
                      ? "Task completed"
                      : hasError
                        ? "Task failed"
                        : "Task ready"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {activeSteps.length} step{activeSteps.length !== 1 ? "s" : ""}
                </div>
              </div>
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                isOpen && "rotate-180",
              )}
            />
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="border-t">
          <div className="p-4 space-y-3">
            {activeSteps.map((step, index) => (
              <div key={step.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  {getStepIcon(step.status)}
                  {index < activeSteps.length - 1 && (
                    <div className="w-px h-8 bg-border mt-2" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {getToolIcon(step.id)}
                    <span className="font-medium text-sm">{step.name}</span>
                    {getStatusBadge(step.status)}
                  </div>

                  <p className="text-xs text-muted-foreground mb-2">
                    {step.description}
                  </p>

                  {step.startTime && (
                    <div className="text-xs text-muted-foreground">
                      Duration: {formatDuration(step.startTime, step.endTime)}
                    </div>
                  )}

                  {step.input && Object.keys(step.input).length > 0 && (
                    <details className="mt-2">
                      <summary className="text-xs cursor-pointer text-muted-foreground hover:text-foreground">
                        View input
                      </summary>
                      <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-x-auto">
                        {Object.entries(step.input).map(([key, value]) => (
                          <div key={key}>
                            <span className="text-muted-foreground">
                              {key}:
                            </span>{" "}
                            {formatValue(value)}
                          </div>
                        ))}
                      </pre>
                    </details>
                  )}

                  {step.output != null && (
                    <details className="mt-2">
                      <summary className="text-xs cursor-pointer text-muted-foreground hover:text-foreground">
                        View output
                      </summary>
                      <div className="bg-muted rounded mt-1 max-h-32">
                        <DomaScrollbars
                          options={{
                            overflow: { x: "scroll", y: "scroll" },
                            scrollbars: {
                              autoHide: "move",
                              autoHideDelay: 500,
                            },
                          }}
                        >
                          <pre className="text-xs p-2">
                            {formatValue(step.output)}
                          </pre>
                        </DomaScrollbars>
                      </div>
                    </details>
                  )}

                  {step.error && (
                    <div className="mt-2 p-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-950 rounded">
                      <p className="text-xs text-red-700 dark:text-red-400">
                        {step.error}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export { ToolProgress };
