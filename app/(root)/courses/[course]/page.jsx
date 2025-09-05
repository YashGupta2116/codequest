"use client";
import React, { useState, use, useEffect } from "react";
import Levelcard from "@/components/Levelcard";
import { useRouter } from "next/navigation";
import { getRoadmapByLanguage } from "@/actions/getRoadmap";

const CoursePage = ({ params }) => {
  const [currentidx, setCurrentidx] = useState(null);
  const [currentLevel, setcurrentLevel] = useState(0);
  const [roadmapData, setRoadmapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userTotalXp, setUserTotalXp] = useState(0);
  const { course } = use(params);
  const router = useRouter();

  // Load roadmap data on component mount
  useEffect(() => {
    const loadRoadmapData = async () => {
      try {
        setLoading(true);

        // Try to get from localStorage first (for immediate access)
        const storedData = localStorage.getItem(`roadmap:${course}`);
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setRoadmapData(parsedData);
        }

        // Try to get data from database
        try {
          const userRoadmap = await getRoadmapByLanguage(course);
          if (userRoadmap) {
            setRoadmapData(userRoadmap);
            setUserTotalXp(userRoadmap.userTotalXp || 0);
          }
        } catch (dbError) {
          console.log("Database error, using localStorage data");
        }

        if (!storedData) {
          // If no data found, redirect back to courses page
          router.push("/courses");
        }
      } catch (error) {
        console.error("Error loading roadmap data:", error);
        router.push("/courses");
      } finally {
        setLoading(false);
      }
    };

    loadRoadmapData();
  }, [course, router]);

  // Transform roadmap data to match the expected format
  const leveldata =
    roadmapData?.levels?.map((level) => {
      const userProgress = level.userProgress?.[0];
      const isCompleted = userProgress?.isCompleted || false;
      const progressPercentage = isCompleted ? 100 : 0;

      return {
        level: level.levelNumber,
        description: level.topic,
        status: progressPercentage,
        title: level.levelTitle,
        difficulty: level.difficulty,
        xpReward: level.xpReward,
        isCompleted: isCompleted,
        userProgress: userProgress,
        assignments: level.assignments,
        miniBoss: level.miniBoss,
        bigBoss: level.bigBoss,
        textContent: level.textContent,
      };
    }) || [];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0F2027] via-[#2C5364] to-[#2C5364] flex justify-center items-center p-3 sm:p-6">
      <div className="w-full max-w-7xl h-[calc(100vh-1.5rem)] sm:h-[calc(100vh-3rem)] flex flex-col lg:flex-row gap-4 sm:gap-6 pt-20">
        {/* Left Column - Scrollable with Hidden Scrollbar */}
        <div className="w-full lg:w-[35%] h-64 lg:h-full bg-gradient-to-b from-[#1e293b]/80 to-[#0f172a]/80 backdrop-blur-md rounded-2xl shadow-2xl p-3 sm:p-4 overflow-hidden border border-slate-600/50">
          <div className="h-full overflow-y-auto space-y-3 sm:space-y-4 pr-2 scrollbar-hide">
            {leveldata.map((idx, key) => (
              <div
                key={key}
                onClick={() => {
                  setCurrentidx(idx);
                  setcurrentLevel(idx.level);
                }}
                className="w-full flex justify-center items-center cursor-pointer transform hover:scale-[1.02] transition-all duration-200"
              >
                <Levelcard
                  description={idx.description}
                  status={idx.status}
                  level={idx.level}
                />
              </div>
            ))}
            <div className="h-4"></div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-[65%] flex-1 lg:h-full bg-[#0f172a]/40 backdrop-blur-md rounded-2xl p-4 sm:p-6 lg:p-10 shadow-xl border border-slate-700/50 flex flex-col justify-between">
          {loading && (
            <div className="text-center flex-1 flex flex-col justify-center items-center px-2">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-slate-300 text-sm sm:text-lg">
                Loading roadmap...
              </p>
            </div>
          )}

          {!loading && !currentidx && (
            <div className="text-center flex-1 flex flex-col justify-center items-center px-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-4 leading-tight">
                Welcome to CodeQuest 🚀
              </h1>
              <p className="text-slate-300 text-sm sm:text-lg max-w-md">
                Start learning{" "}
                <span className="text-yellow-400 font-semibold capitalize">
                  {course}
                </span>{" "}
                step by step.
              </p>
              {userTotalXp > 0 && (
                <div className="mt-4 px-4 py-2 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                  <p className="text-yellow-400 font-semibold">
                    Total XP: {userTotalXp} ⭐
                  </p>
                </div>
              )}
              <p className="text-slate-400 text-xs sm:text-sm mt-3 lg:hidden">
                Select a level above to begin
              </p>
            </div>
          )}

          {currentidx && (
            <div className="flex flex-col justify-between flex-1 min-h-0">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight">
                    {currentidx.title}
                  </h1>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        currentidx.difficulty === "Easy"
                          ? "bg-green-500/20 text-green-400"
                          : currentidx.difficulty === "Medium"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {currentidx.difficulty}
                    </span>
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold">
                      +{currentidx.xpReward} XP
                    </span>
                  </div>
                </div>

                <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed mb-4">
                  {currentidx.description}
                </p>

                {currentidx.textContent && (
                  <div className="mb-4 p-3 bg-slate-800/50 rounded-lg border border-slate-600/30">
                    <h3 className="text-slate-200 font-semibold mb-2">
                      📚 Learning Content:
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {currentidx.textContent}
                    </p>
                  </div>
                )}

                {currentidx.assignments &&
                  currentidx.assignments.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-slate-200 font-semibold mb-2">
                        🎯 Assignments:
                      </h3>
                      <div className="space-y-2">
                        {currentidx.assignments.map((assignment, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-slate-800/30 rounded-lg border border-slate-600/20"
                          >
                            <h4 className="text-slate-200 font-medium text-sm">
                              {assignment.title}
                            </h4>
                            <p className="text-slate-400 text-xs mt-1">
                              {assignment.description}
                            </p>
                            {assignment.sampleInput && (
                              <div className="mt-2 text-xs">
                                <span className="text-slate-500">
                                  Sample Input:{" "}
                                </span>
                                <code className="text-green-400 bg-slate-900/50 px-1 rounded">
                                  {assignment.sampleInput}
                                </code>
                              </div>
                            )}
                            {assignment.sampleOutput && (
                              <div className="mt-1 text-xs">
                                <span className="text-slate-500">
                                  Expected Output:{" "}
                                </span>
                                <code className="text-blue-400 bg-slate-900/50 px-1 rounded">
                                  {assignment.sampleOutput}
                                </code>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {currentidx.miniBoss && (
                  <div className="mb-4 p-3 bg-purple-500/10 rounded-lg border border-purple-500/30">
                    <h3 className="text-purple-400 font-semibold mb-2">
                      ⚔️ Mini-Boss Challenge:
                    </h3>
                    <h4 className="text-slate-200 font-medium text-sm mb-1">
                      {currentidx.miniBoss.title}
                    </h4>
                    <p className="text-slate-300 text-xs mb-2">
                      {currentidx.miniBoss.description}
                    </p>
                    <div className="text-xs">
                      <span className="text-slate-500">Requirements:</span>
                      <ul className="list-disc list-inside text-slate-400 mt-1">
                        {currentidx.miniBoss.requirements.map((req, idx) => (
                          <li key={idx}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {currentidx.bigBoss && (
                  <div className="mb-4 p-3 bg-red-500/10 rounded-lg border border-red-500/30">
                    <h3 className="text-red-400 font-semibold mb-2">
                      🔥 Big Boss Challenge:
                    </h3>
                    <h4 className="text-slate-200 font-medium text-sm mb-1">
                      {currentidx.bigBoss.title}
                    </h4>
                    <p className="text-slate-300 text-xs mb-2">
                      {currentidx.bigBoss.description}
                    </p>
                    <div className="text-xs">
                      <span className="text-slate-500">Requirements:</span>
                      <ul className="list-disc list-inside text-slate-400 mt-1">
                        {currentidx.bigBoss.requirements.map((req, idx) => (
                          <li key={idx}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="mt-4 sm:mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-400 text-xs sm:text-sm">
                      Progress
                    </span>
                    <span className="text-slate-300 text-xs sm:text-sm font-semibold">
                      {currentidx.status}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2 sm:h-3">
                    <div
                      className={`h-2 sm:h-3 rounded-full transition-all duration-500 ${
                        currentidx.isCompleted
                          ? "bg-gradient-to-r from-green-500 to-emerald-600"
                          : "bg-gradient-to-r from-blue-500 to-purple-600"
                      }`}
                      style={{ width: `${currentidx.status}%` }}
                    ></div>
                  </div>
                  {currentidx.isCompleted && (
                    <p className="text-green-400 text-xs mt-1">
                      ✅ Level Completed!
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end mt-6 sm:mt-8">
                <button
                  onClick={() => {
                    // Store the current level data in localStorage for the level page
                    const levelDataForStorage = {
                      ...currentidx,
                      roadmapInfo: {
                        language: course,
                        title: roadmapData?.title || `${course} Roadmap`,
                        description:
                          roadmapData?.description ||
                          `Learn ${course} step by step`,
                      },
                      userTotalXp: userTotalXp,
                      previousLevel:
                        currentidx.level > 1
                          ? {
                              levelNumber: currentidx.level - 1,
                              levelTitle:
                                leveldata.find(
                                  (l) => l.level === currentidx.level - 1
                                )?.title || `Level ${currentidx.level - 1}`,
                            }
                          : null,
                      nextLevel:
                        currentidx.level < leveldata.length
                          ? {
                              levelNumber: currentidx.level + 1,
                              levelTitle:
                                leveldata.find(
                                  (l) => l.level === currentidx.level + 1
                                )?.title || `Level ${currentidx.level + 1}`,
                            }
                          : null,
                    };

                    localStorage.setItem(
                      `levelData:${course}:${currentidx.level}`,
                      JSON.stringify(levelDataForStorage)
                    );
                    router.push(`/courses/${course}/level-${currentidx.level}`);
                  }}
                  className={`px-4 py-2 sm:px-6 sm:py-3 active:scale-95 text-white font-semibold text-sm sm:text-base rounded-xl shadow-md transition-all duration-300 ${
                    currentidx.isCompleted
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {currentidx.isCompleted ? "Review Level" : "Start Learning"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
