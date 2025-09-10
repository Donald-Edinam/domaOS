"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, TrendingUp, DollarSign, Zap, X } from "lucide-react";

interface DomainAnalysisResult {
  domain: string;
  tokens: string[];
  marketScore: number;
  acquisitionPotential: "high" | "medium" | "low";
  reasoning: string;
  keyFactors: string[];
  estimatedValue: string;
}

interface DomainAnalysisProps {
  results: DomainAnalysisResult[];
  isAnalyzing?: boolean;
  onClose?: () => void;
}

export function DomainAnalysis({
  results,
  isAnalyzing = false,
  onClose,
}: DomainAnalysisProps) {
  if (isAnalyzing) {
    return (
      <Card className="w-full max-w-4xl mx-auto bg-gray-800/80 backdrop-blur-sm border border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-cyan-300 flex items-center gap-2">
            <Brain className="h-5 w-5 animate-pulse" />
            Analyzing Domains...
          </CardTitle>
          <CardDescription className="text-gray-400">
            Tokenizing and evaluating domain acquisition potential
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-2 bg-gray-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getPotentialColor = (potential: string) => {
    switch (potential) {
      case "high":
        return "bg-green-500 text-white";
      case "medium":
        return "bg-yellow-500 text-black";
      case "low":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-400";
    if (score >= 40) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-cyan-300 flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Domain Tokenization Analysis
              </CardTitle>
              <CardDescription className="text-gray-400">
                AI-powered domain evaluation and acquisition recommendations
              </CardDescription>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6">
        {results.map((result, index) => (
          <Card
            key={index}
            className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 hover:border-cyan-400/30 transition-all duration-200"
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg">
                  {result.domain}
                </CardTitle>
                <Badge
                  className={getPotentialColor(result.acquisitionPotential)}
                >
                  {result.acquisitionPotential.toUpperCase()} POTENTIAL
                </Badge>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-cyan-400" />
                  <span
                    className={`font-mono text-sm ${getScoreColor(result.marketScore)}`}
                  >
                    Score: {result.marketScore}/100
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-400" />
                  <span className="text-green-400 text-sm font-medium">
                    {result.estimatedValue}
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Market Score</span>
                  <span className={getScoreColor(result.marketScore)}>
                    {result.marketScore}%
                  </span>
                </div>
                <Progress
                  value={result.marketScore}
                  className="h-2 bg-gray-700"
                  style={{
                    background:
                      "linear-gradient(to right, #ef4444, #eab308, #22c55e)",
                  }}
                />
              </div>

              {/* Tokens */}
              <div>
                <h4 className="text-sm font-semibold text-cyan-300 mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Tokenization
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.tokens.map((token, tokenIndex) => (
                    <Badge
                      key={tokenIndex}
                      variant="outline"
                      className="bg-gray-700/50 text-gray-300 border-gray-600"
                    >
                      {token}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Key Factors */}
              <div>
                <h4 className="text-sm font-semibold text-cyan-300 mb-2">
                  Key Factors
                </h4>
                <ul className="space-y-1">
                  {result.keyFactors.map((factor, factorIndex) => (
                    <li
                      key={factorIndex}
                      className="text-sm text-gray-400 flex items-center gap-2"
                    >
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full flex-shrink-0" />
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Reasoning */}
              <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/30">
                <p className="text-gray-300 text-sm leading-relaxed">
                  {result.reasoning}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
