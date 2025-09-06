"use client";
import React, { useState, useEffect } from "react";
import {
  FaCode,
  FaFire,
  FaTrophy,
  FaStar,
  FaPlay,
  FaLock,
  FaClock,
  FaRandom,
  FaLightbulb,
  FaRocket,
  FaBolt,
  FaGamepad,
  FaChevronRight,
  FaHistory,
  FaFilter,
  FaCopy,
  FaCheck,
} from "react-icons/fa";
import { SiPython, SiCplusplus, SiJavascript } from "react-icons/si";
import { RiSwordFill, RiShieldKeyholeFill } from "react-icons/ri";
import { GiCrossedSwords, GiTrophy, GiLightningBow } from "react-icons/gi";
import { IoFlash, IoCodeSlash } from "react-icons/io5";
import { BsLightning, BsDiamond } from "react-icons/bs";
import Navbar from "@/components/Navbar";
import { generateChallenge } from "@/actions/generateChallenge";
import { saveChallenge } from "@/actions/saveChallenge";
import { useRouter } from "next/navigation";

const TrainingGrounds = () => {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [challengesUsed, setChallengesUsed] = useState(3);
  const [maxChallenges, setMaxChallenges] = useState(25);
  const [currentStreak, setCurrentStreak] = useState(7);
  const [totalXP, setTotalXP] = useState(1847);
  const [rank, setRank] = useState(42);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [error, setError] = useState("");
  const [copiedTest, setCopiedTest] = useState(null);

  const languages = [
    {
      id: "python",
      name: "Python",
      icon: <SiPython className="text-2xl text-yellow-400" />,
      color: "from-yellow-400 to-orange-500",
      bgColor: "from-yellow-500/20 to-orange-500/10",
      borderColor: "border-yellow-500/30",
    },
    {
      id: "cpp",
      name: "C++",
      icon: <SiCplusplus className="text-2xl text-blue-400" />,
      color: "from-blue-400 to-purple-500",
      bgColor: "from-blue-500/20 to-purple-500/10",
      borderColor: "border-blue-500/30",
    },
    {
      id: "java",
      name: "Java",
      icon: (
        <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
          J
        </div>
      ),
      color: "from-red-500 to-orange-600",
      bgColor: "from-red-500/20 to-orange-500/10",
      borderColor: "border-red-500/30",
    },
  ];

  const difficulties = [
    { id: "all", name: "All Levels", icon: <FaGamepad />, xp: "" },
    {
      id: "beginner",
      name: "Beginner",
      icon: <FaLightbulb />,
      xp: "50-100 XP",
    },
    {
      id: "intermediate",
      name: "Intermediate",
      icon: <FaBolt />,
      xp: "100-250 XP",
    },
    { id: "advanced", name: "Advanced", icon: <FaRocket />, xp: "250-500 XP" },
    { id: "expert", name: "Expert", icon: <GiCrossedSwords />, xp: "500+ XP" },
  ];

  const recentChallenges = [
    {
      id: 1,
      title: "List Slicing Master",
      difficulty: "Beginner",
      language: "Python",
      xp: 75,
      completed: true,
      time: "2m 34s",
    },
    {
      id: 2,
      title: "Binary Tree Traversal",
      difficulty: "Advanced",
      language: "C++",
      xp: 350,
      completed: true,
      time: "8m 12s",
    },
    {
      id: 3,
      title: "HashMap Implementation",
      difficulty: "Intermediate",
      language: "Java",
      xp: 200,
      completed: false,
      time: "In Progress",
    },
  ];

  const challengeTemplates = {
    python: [
      "Create a function that solves list manipulation problems",
      "Build a data structure using Python classes",
      "Implement algorithm optimization challenges",
      "Solve string processing and regex problems",
    ],
    cpp: [
      "Design memory-efficient data structures",
      "Implement low-level system programming challenges",
      "Create performance optimization problems",
      "Build template-based generic solutions",
    ],
    java: [
      "Develop object-oriented design patterns",
      "Create multithreading synchronization challenges",
      "Build enterprise-level application problems",
      "Implement collection framework optimizations",
    ],
  };

  const handleGenerateChallenge = async () => {
    if (challengesUsed >= maxChallenges) return;

    setIsGenerating(true);
    setError("");

    try {
      const result = await generateChallenge(
        selectedLanguage,
        selectedDifficulty,
        customPrompt
      );

      if (result.success) {
        // Save challenge to database
        const saveResult = await saveChallenge(result.challenge);

        if (saveResult.success) {
          setCurrentChallenge({
            ...result.challenge,
            id: saveResult.challenge.id,
          });
          setChallengesUsed((prev) => prev + 1);
          setCustomPrompt(""); // Clear custom prompt after successful generation
        } else {
          setError("Failed to save challenge. Please try again.");
        }
      } else {
        setError(result.message || "Failed to generate challenge");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Challenge generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartChallenge = () => {
    if (currentChallenge?.id) {
      router.push(`/challenge/${currentChallenge.id}`);
    }
  };

  const copyToClipboard = async (text, testIndex) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTest(testIndex);
      setTimeout(() => setCopiedTest(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const currentLang = languages.find((lang) => lang.id === selectedLanguage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F2027] via-[#2C5364] to-[#2C5364] text-white pt-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Header */}
        <div className="mb-10">
          <div className="relative overflow-hidden bg-slate-900/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
            {/* Animated background elements */}
            <div className="absolute inset-0">
              <div className="absolute top-0 right-1/4 w-40 h-40 bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
              <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-gradient-to-tr from-blue-500/15 to-purple-600/15 rounded-full blur-3xl animate-pulse delay-2000"></div>
              <div className="absolute top-1/2 right-0 w-24 h-24 bg-gradient-to-l from-green-500/20 to-emerald-600/20 rounded-full blur-2xl animate-pulse delay-500"></div>
            </div>

            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row items-center justify-between">
                <div className="max-w-4xl mb-6 lg:mb-0">
                  <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-orange-500/20 via-red-500/20 to-purple-500/20 px-6 py-3 rounded-full border border-orange-400/30 mb-6">
                    <GiLightningBow className="text-orange-400 animate-pulse" />
                    <span className="text-sm font-semibold bg-gradient-to-r from-orange-400 via-red-400 to-purple-400 bg-clip-text text-transparent">
                      AI-Generated Coding Challenges
                    </span>
                  </div>

                  <h1 className="text-5xl lg:text-7xl font-black mb-4 leading-tight">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-300">
                      Training
                    </span>
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-purple-500">
                      Grounds
                    </span>
                  </h1>

                  <p className="text-xl text-slate-300 mb-6 leading-relaxed max-w-3xl">
                    Challenge yourself with AI-generated coding problems
                    tailored to your skill level.
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400 font-semibold">
                      {" "}
                      Level up your programming skills!
                    </span>
                  </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4 lg:gap-6">
                  <div className="bg-gradient-to-br from-orange-500/20 to-red-500/10 backdrop-blur-sm p-4 lg:p-6 rounded-2xl border border-orange-500/30 text-center">
                    <FaFire className="text-orange-400 text-2xl lg:text-3xl mx-auto mb-2" />
                    <div className="text-xl lg:text-2xl font-bold text-orange-400">
                      {currentStreak}
                    </div>
                    <div className="text-xs lg:text-sm text-slate-400">
                      Day Streak
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/10 backdrop-blur-sm p-4 lg:p-6 rounded-2xl border border-purple-500/30 text-center">
                    <FaStar className="text-yellow-400 text-2xl lg:text-3xl mx-auto mb-2" />
                    <div className="text-xl lg:text-2xl font-bold text-yellow-400">
                      {totalXP.toLocaleString()}
                    </div>
                    <div className="text-xs lg:text-sm text-slate-400">
                      Total XP
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 backdrop-blur-sm p-4 lg:p-6 rounded-2xl border border-green-500/30 text-center">
                    <FaTrophy className="text-yellow-400 text-2xl lg:text-3xl mx-auto mb-2" />
                    <div className="text-xl lg:text-2xl font-bold text-green-400">
                      #{rank}
                    </div>
                    <div className="text-xs lg:text-sm text-slate-400">
                      Global Rank
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Challenge Generator */}
          <div className="lg:col-span-2">
            {/* Challenge Usage Counter */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold flex items-center space-x-2">
                  <BsDiamond className="text-purple-400" />
                  <span>Daily Challenges</span>
                </h3>
                <div className="text-sm text-slate-400">Resets in 18h 23m</div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-lg mb-2">
                  <span>Challenges Used</span>
                  <span className="font-bold">
                    <span
                      className={
                        challengesUsed >= maxChallenges
                          ? "text-red-400"
                          : "text-emerald-400"
                      }
                    >
                      {challengesUsed}
                    </span>
                    <span className="text-slate-400">/{maxChallenges}</span>
                  </span>
                </div>
                <div className="w-full bg-slate-800/50 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      challengesUsed >= maxChallenges
                        ? "bg-gradient-to-r from-red-500 to-red-600"
                        : "bg-gradient-to-r from-emerald-400 to-blue-500"
                    }`}
                    style={{
                      width: `${(challengesUsed / maxChallenges) * 100}%`,
                    }}
                  ></div>
                </div>
                <p className="text-sm text-slate-400 mt-2">
                  {maxChallenges - challengesUsed} challenges remaining today
                </p>
              </div>
            </div>

            {/* Language & Difficulty Selection */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-xl mb-8">
              {/* Language Selection */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                  <IoCodeSlash className="text-blue-400" />
                  <span>Choose Your Weapon</span>
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {languages.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => setSelectedLanguage(lang.id)}
                      className={`group p-6 rounded-2xl border-2 transition-all duration-200 ${
                        selectedLanguage === lang.id
                          ? `bg-gradient-to-br ${lang.bgColor} ${lang.borderColor} shadow-lg scale-105`
                          : "bg-slate-800/40 border-slate-600/30 hover:border-slate-500/50 hover:bg-slate-800/60"
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        {lang.icon}
                        <span className="font-bold text-lg">{lang.name}</span>
                      </div>
                      <div
                        className={`w-full bg-slate-700/50 rounded-full h-2 ${
                          selectedLanguage === lang.id ? "bg-opacity-30" : ""
                        }`}
                      >
                        <div
                          className={`h-2 rounded-full bg-gradient-to-r ${lang.color} transition-all duration-300`}
                          style={{
                            width: `${
                              70 +
                              (lang.id === "python"
                                ? 20
                                : lang.id === "cpp"
                                ? 15
                                : 10)
                            }%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-slate-400 mt-2">
                        Mastery Progress
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Selection */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                  <RiShieldKeyholeFill className="text-emerald-400" />
                  <span>Challenge Difficulty</span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {difficulties.map((diff) => (
                    <button
                      key={diff.id}
                      onClick={() => setSelectedDifficulty(diff.id)}
                      className={`p-4 rounded-xl border transition-all duration-200 ${
                        selectedDifficulty === diff.id
                          ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 scale-105"
                          : "bg-slate-800/40 border-slate-600/30 hover:border-slate-500/50 hover:bg-slate-700/50"
                      }`}
                    >
                      <div className="text-xl mb-2">{diff.icon}</div>
                      <div className="text-sm font-semibold mb-1">
                        {diff.name}
                      </div>
                      {diff.xp && (
                        <div className="text-xs text-slate-400">{diff.xp}</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Challenge Input */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                  <FaLightbulb className="text-yellow-400" />
                  <span>Custom Challenge Request</span>
                  <span className="text-sm text-slate-400 font-normal">
                    (Optional)
                  </span>
                </h3>
                <div className="relative">
                  <textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder={`Describe what kind of ${currentLang?.name} challenge you want... (e.g., "Create a function that works with binary trees and recursion")`}
                    className="w-full bg-slate-800/60 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 backdrop-blur-sm resize-none"
                    rows="3"
                  />
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
                  <div className="flex items-center space-x-2 text-red-400">
                    <span className="text-sm font-medium">⚠️ {error}</span>
                  </div>
                </div>
              )}

              {/* Generate Button */}
              <div className="text-center">
                <button
                  onClick={handleGenerateChallenge}
                  disabled={challengesUsed >= maxChallenges || isGenerating}
                  className={`group relative overflow-hidden px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
                    challengesUsed >= maxChallenges
                      ? "bg-gray-600 cursor-not-allowed opacity-50"
                      : `bg-gradient-to-r ${currentLang?.color} hover:shadow-orange-500/25`
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center space-x-3">
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Generating Challenge...</span>
                      </>
                    ) : challengesUsed >= maxChallenges ? (
                      <>
                        <FaLock />
                        <span>Daily Limit Reached</span>
                      </>
                    ) : (
                      <>
                        <FaRandom className="group-hover:animate-bounce" />
                        <span>Generate New Challenge</span>
                        <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </button>

                {challengesUsed < maxChallenges && (
                  <p className="text-sm text-slate-400 mt-3">
                    Takes about 45 seconds • Powered by AI
                  </p>
                )}
              </div>
            </div>

            {/* Challenge Display */}
            {!currentChallenge ? (
              <div className="bg-slate-900/30 backdrop-blur-md rounded-2xl p-8 border border-slate-700/30 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaGamepad className="text-3xl text-slate-400" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-300">
                  Ready to Start Training?
                </h3>
                <p className="text-slate-400">
                  Click the generate button above to get your first AI-powered
                  coding challenge!
                </p>
              </div>
            ) : (
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold flex items-center space-x-2">
                    <IoFlash className="text-yellow-400" />
                    <span>{currentChallenge.title}</span>
                  </h3>
                  <div className="flex items-center space-x-2 bg-green-500/20 px-3 py-1 rounded-full border border-green-500/30">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-400 font-medium">
                      Active
                    </span>
                  </div>
                </div>

                {/* Challenge Description */}
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-600/30 mb-4">
                  <p className="text-slate-200 leading-relaxed mb-4">
                    {currentChallenge.description}
                  </p>

                  {/* Input/Output Format */}
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-slate-700/50 rounded-lg p-3">
                      <h4 className="text-sm font-semibold text-blue-400 mb-2">
                        Input Format
                      </h4>
                      <p className="text-sm text-slate-300">
                        {currentChallenge.inputFormat}
                      </p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-3">
                      <h4 className="text-sm font-semibold text-green-400 mb-2">
                        Output Format
                      </h4>
                      <p className="text-sm text-slate-300">
                        {currentChallenge.outputFormat}
                      </p>
                    </div>
                  </div>

                  {/* Constraints */}
                  {currentChallenge.constraints && (
                    <div className="bg-slate-700/50 rounded-lg p-3 mb-4">
                      <h4 className="text-sm font-semibold text-orange-400 mb-2">
                        Constraints
                      </h4>
                      <p className="text-sm text-slate-300">
                        {currentChallenge.constraints}
                      </p>
                    </div>
                  )}
                </div>

                {/* Test Cases */}
                <div className="mb-4">
                  <h4 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                    <FaCode className="text-purple-400" />
                    <span>Test Cases</span>
                  </h4>
                  <div className="space-y-3">
                    {currentChallenge.testCases.map((testCase, index) => (
                      <div
                        key={index}
                        className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-300">
                            Test Case {index + 1}
                          </span>
                          <button
                            onClick={() =>
                              copyToClipboard(testCase.input, index)
                            }
                            className="text-xs text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                          >
                            {copiedTest === index ? <FaCheck /> : <FaCopy />}
                            <span>
                              {copiedTest === index ? "Copied!" : "Copy Input"}
                            </span>
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

                {/* Hints */}
                {currentChallenge.hints &&
                  currentChallenge.hints.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                        <FaLightbulb className="text-yellow-400" />
                        <span>Hints</span>
                      </h4>
                      <div className="space-y-2">
                        {currentChallenge.hints.map((hint, index) => (
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

                {/* Challenge Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-slate-400">
                    <span>
                      Estimated time: {currentChallenge.estimatedTime}
                    </span>
                    <span>•</span>
                    <span>XP Reward: {currentChallenge.xpReward}</span>
                    <span>•</span>
                    <span className="capitalize">
                      {currentChallenge.difficulty}
                    </span>
                  </div>
                  <button
                    onClick={handleStartChallenge}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-6 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
                  >
                    Start Challenge
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
              <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
                <BsLightning className="text-purple-400" />
                <span>Training Stats</span>
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Challenges Completed</span>
                  <span className="font-bold text-emerald-400">47</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">
                    Average Completion Time
                  </span>
                  <span className="font-bold text-blue-400">12m 34s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Success Rate</span>
                  <span className="font-bold text-yellow-400">87%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Best Language</span>
                  <div className="flex items-center space-x-2">
                    <SiPython className="text-yellow-400" />
                    <span className="font-bold">Python</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
              <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
                <FaHistory className="text-blue-400" />
                <span>Recent Challenges</span>
              </h3>
              <div className="space-y-4">
                {recentChallenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className="p-4 bg-slate-800/50 rounded-xl border border-slate-600/30 hover:border-slate-500/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-sm">
                        {challenge.title}
                      </h4>
                      <div
                        className={`w-3 h-3 rounded-full ${
                          challenge.completed ? "bg-green-400" : "bg-yellow-400"
                        }`}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>
                        {challenge.difficulty} • {challenge.language}
                      </span>
                      <span>+{challenge.xp} XP</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {challenge.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Challenge Tips */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
              <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                <FaLightbulb className="text-yellow-400" />
                <span>Pro Tips</span>
              </h3>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div className="text-blue-400 font-medium mb-1">
                    Be Specific
                  </div>
                  <div className="text-slate-300">
                    The more specific your custom prompt, the better your
                    challenge will be!
                  </div>
                </div>
                <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="text-green-400 font-medium mb-1">
                    Start Small
                  </div>
                  <div className="text-slate-300">
                    Begin with easier challenges to build confidence and
                    momentum.
                  </div>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <div className="text-purple-400 font-medium mb-1">
                    Stay Consistent
                  </div>
                  <div className="text-slate-300">
                    Daily practice is key to maintaining and improving your
                    coding skills.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingGrounds;
