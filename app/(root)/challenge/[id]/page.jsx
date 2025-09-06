"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FaArrowLeft,
  FaClock,
  FaTrophy,
  FaLightbulb,
  FaCode,
  FaCheck,
  FaTimes,
  FaCopy,
} from "react-icons/fa";
import { SiPython, SiCplusplus } from "react-icons/si";
import Navbar from "@/components/Navbar";
import CodeEditor from "@/components/CodeEditor";
import { startChallenge } from "@/actions/startChallenge";
import { submitChallenge } from "@/actions/submitChallenge";

const ChallengePage = () => {
  const params = useParams();
  const router = useRouter();
  const challengeId = params.id;

  const [userChallenge, setUserChallenge] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [error, setError] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    if (challengeId) {
      loadChallenge();
    }
  }, [challengeId]);

  const loadChallenge = async () => {
    try {
      setIsLoading(true);
      const result = await startChallenge(challengeId);

      if (result.success) {
        setUserChallenge(result.userChallenge);
        setCode(result.userChallenge.codeSolution || "");
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Failed to load challenge");
      console.error("Error loading challenge:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  const handleSubmit = async (submittedCode) => {
    if (!userChallenge) return;

    try {
      setIsSubmitting(true);
      setTestResults(null);

      const result = await submitChallenge(userChallenge.id, submittedCode);

      if (result.success) {
        setTestResults(result.validationResult);
        setUserChallenge(result.userChallenge);

        if (result.validationResult.success) {
          // Show success message and redirect after a delay
          setTimeout(() => {
            router.push("/training");
          }, 3000);
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Failed to submit solution");
      console.error("Error submitting challenge:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const getLanguageIcon = (language) => {
    switch (language.toLowerCase()) {
      case "python":
        return <SiPython className="text-yellow-400 text-xl" />;
      case "cpp":
        return <SiCplusplus className="text-blue-400 text-xl" />;
      default:
        return <FaCode className="text-slate-400 text-xl" />;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "text-green-400 bg-green-500/20 border-green-500/30";
      case "intermediate":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
      case "advanced":
        return "text-orange-400 bg-orange-500/20 border-orange-500/30";
      case "expert":
        return "text-red-400 bg-red-500/20 border-red-500/30";
      default:
        return "text-slate-400 bg-slate-500/20 border-slate-500/30";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F2027] via-[#2C5364] to-[#2C5364] text-white pt-20">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-white border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !userChallenge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F2027] via-[#2C5364] to-[#2C5364] text-white pt-20">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6 text-center">
            <FaTimes className="text-red-400 text-3xl mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-400 mb-2">
              Error Loading Challenge
            </h2>
            <p className="text-slate-300 mb-4">
              {error || "Challenge not found"}
            </p>
            <button
              onClick={() => router.push("/training")}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-2 rounded-lg font-semibold transition-all duration-200"
            >
              Back to Training
            </button>
          </div>
        </div>
      </div>
    );
  }

  const challenge = userChallenge.challenge;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F2027] via-[#2C5364] to-[#2C5364] text-white pt-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/training")}
            className="flex items-center space-x-2 text-slate-400 hover:text-slate-300 transition-colors mb-4"
          >
            <FaArrowLeft />
            <span>Back to Training</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">{challenge.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-slate-400">
                <div className="flex items-center space-x-2">
                  {getLanguageIcon(challenge.language)}
                  <span className="capitalize">{challenge.language}</span>
                </div>
                <span>•</span>
                <div
                  className={`px-3 py-1 rounded-full border capitalize ${getDifficultyColor(
                    challenge.difficulty
                  )}`}
                >
                  {challenge.difficulty}
                </div>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <FaClock />
                  <span>{challenge.estimatedTime}</span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <FaTrophy />
                  <span>{challenge.xpReward} XP</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-slate-400 mb-1">Status</div>
              <div
                className={`px-3 py-1 rounded-full border text-sm font-medium ${
                  userChallenge.status === "completed"
                    ? "text-green-400 bg-green-500/20 border-green-500/30"
                    : "text-yellow-400 bg-yellow-500/20 border-yellow-500/30"
                }`}
              >
                {userChallenge.status === "completed"
                  ? "Completed"
                  : "In Progress"}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Challenge Description */}
          <div className="space-y-6">
            {/* Problem Description */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
              <h3 className="text-xl font-bold mb-4">Problem Description</h3>
              <p className="text-slate-200 leading-relaxed whitespace-pre-line">
                {challenge.description}
              </p>
            </div>

            {/* Input/Output Format */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
              <h3 className="text-xl font-bold mb-4">Input/Output Format</h3>
              <div className="space-y-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-blue-400 mb-2">
                    Input Format
                  </h4>
                  <p className="text-sm text-slate-300 whitespace-pre-line">
                    {challenge.inputFormat}
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-green-400 mb-2">
                    Output Format
                  </h4>
                  <p className="text-sm text-slate-300 whitespace-pre-line">
                    {challenge.outputFormat}
                  </p>
                </div>
              </div>
            </div>

            {/* Test Cases */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
              <h3 className="text-xl font-bold mb-4">Test Cases</h3>
              <div className="space-y-3">
                {challenge.testCases.map((testCase, index) => (
                  <div key={index} className="bg-slate-800/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-300">
                        Test Case {index + 1}
                      </span>
                      <button
                        onClick={() => copyToClipboard(testCase.input)}
                        className="text-xs text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                      >
                        <FaCopy />
                        <span>Copy Input</span>
                      </button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs text-slate-400 mb-1">
                          Input:
                        </div>
                        <div className="bg-slate-900/50 rounded p-2 text-sm font-mono text-slate-200">
                          {testCase.input}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 mb-1">
                          Expected Output:
                        </div>
                        <div className="bg-slate-900/50 rounded p-2 text-sm font-mono text-slate-200">
                          {testCase.expectedOutput}
                        </div>
                      </div>
                    </div>
                    {testCase.explanation && (
                      <div className="mt-2 text-xs text-slate-400">
                        <strong>Explanation:</strong> {testCase.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Constraints */}
            {challenge.constraints && (
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
                <h3 className="text-xl font-bold mb-4">Constraints</h3>
                <p className="text-slate-300">{challenge.constraints}</p>
              </div>
            )}

            {/* Hints */}
            {challenge.hints && challenge.hints.length > 0 && (
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
                <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                  <FaLightbulb className="text-yellow-400" />
                  <span>Hints</span>
                </h3>
                <div className="space-y-2">
                  {challenge.hints.map((hint, index) => (
                    <div
                      key={index}
                      className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3"
                    >
                      <div className="text-sm text-yellow-300">
                        <strong>Hint {index + 1}:</strong> {hint}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Code Editor */}
          <div>
            <CodeEditor
              language={challenge.language}
              initialCode={code}
              onCodeChange={handleCodeChange}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              testResults={testResults}
              challenge={challenge}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengePage;
