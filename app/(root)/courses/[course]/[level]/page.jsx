"use client";
import React, { useState, use, useEffect } from "react";
import { getLevelData, updateLevelProgress } from "@/actions/getLevelData";
import { useRouter, useSearchParams } from "next/navigation";
import CodeRunner from "@/components/CodeRunner";

const LevelPage = ({ params }) => {
  const { course, level } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [levelData, setLevelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(0);
  const [userCode, setUserCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  // Extract level number from level parameter (e.g., "level-1" -> 1)
  const levelNumber = level.replace("level-", "");
  console.log(
    "Level parameter:",
    level,
    "Extracted level number:",
    levelNumber
  ); // Debug log

  useEffect(() => {
    const fetchLevelData = async () => {
      try {
        setLoading(true);
        setError(null);

        // First try to get data from localStorage (passed from course page)
        const storedLevelData = localStorage.getItem(
          `levelData:${course}:${levelNumber}`
        );
        if (storedLevelData) {
          const parsedData = JSON.parse(storedLevelData);
          console.log("Stored level data:", parsedData); // Debug log
          setLevelData(parsedData);

          // Set initial code if user has previous submission
          if (parsedData.userProgress?.codeSubmitted) {
            setUserCode(parsedData.userProgress.codeSubmitted);
          }
          setLoading(false);
          return;
        }

        // If no localStorage data, try to get from roadmap data
        const roadmapData = localStorage.getItem(`roadmap:${course}`);
        if (roadmapData) {
          const parsedRoadmap = JSON.parse(roadmapData);
          const level = parsedRoadmap.levels?.find(
            (l) => l.level_number === parseInt(levelNumber)
          );

          if (level) {
            const userProgress = level.userProgress?.[0];
            const isCompleted = userProgress?.isCompleted || false;

            const levelData = {
              ...level,
              level: level.level_number, // Use level_number from backend
              levelNumber: level.level_number, // Also keep levelNumber for compatibility
              levelTitle: level.level_title, // Use level_title from backend
              xpReward: level.xp_reward, // Use xp_reward from backend
              isCompleted,
              xpEarned: userProgress?.xpEarned || 0,
              userProgress: userProgress,
              roadmapInfo: {
                language: parsedRoadmap.language || course,
                title: parsedRoadmap.title || `${course} Roadmap`,
                description:
                  parsedRoadmap.description || `Learn ${course} step by step`,
              },
              userTotalXp: parsedRoadmap.userTotalXp || 0,
            };

            setLevelData(levelData);
            console.log("Level data set:", levelData); // Debug log

            // Set initial code if user has previous submission
            if (userProgress?.codeSubmitted) {
              setUserCode(userProgress.codeSubmitted);
            }
            setLoading(false);
            return;
          }
        }

        // Fallback to fetching from database
        const data = await getLevelData(course, levelNumber);
        setLevelData(data);

        // Set initial code if user has previous submission
        if (data.userProgress?.codeSubmitted) {
          setUserCode(data.userProgress.codeSubmitted);
        }
      } catch (err) {
        console.error("Error fetching level data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLevelData();
  }, [course, levelNumber]);

  const handleCodeSubmission = async (validationResult) => {
    if (!validationResult) {
      setSubmissionResult({
        success: false,
        message: "No validation result received",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const isCompleted = validationResult.success;
      const xpEarned = isCompleted ? levelData.xpReward : 0;
      const codeSubmitted = validationResult.code || userCode;

      // Get the actual level ID from database if not available
      let levelId = levelData.id;
      console.log("🔍 Current levelData.id:", levelData.id);
      console.log("🔍 levelData:", levelData);

      if (!levelId) {
        console.log("🔍 Fetching level data from database...");
        // Fetch level data to get the ID
        const dbLevelData = await getLevelData(course, levelNumber);
        levelId = dbLevelData.id;
        console.log("🔍 Fetched levelId:", levelId);
      }

      console.log("🔍 Final levelId for update:", levelId);

      await updateLevelProgress(levelId, {
        isCompleted,
        codeSubmitted: codeSubmitted,
        xpEarned,
        feedback: validationResult,
      });

      setSubmissionResult({
        success: isCompleted,
        message: validationResult.message,
        hint: validationResult.hint,
        xpEarned: xpEarned,
      });

      // Update local state
      setLevelData((prev) => ({
        ...prev,
        isCompleted,
        xpEarned,
        userTotalXp: prev.userTotalXp + (isCompleted ? xpEarned : 0),
      }));
    } catch (err) {
      console.error("Error submitting code:", err);
      setSubmissionResult({
        success: false,
        message: "Failed to submit code. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-screen h-screen bg-gradient-to-br from-[#0F2027] via-[#2C5364] to-[#2C5364] flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4 mx-auto"></div>
          <p className="text-slate-300 text-lg">Loading level data...</p>
        </div>
      </div>
    );
  }

  if (error || !levelData) {
    return (
      <div className="w-screen h-screen bg-gradient-to-br from-[#0F2027] via-[#2C5364] to-[#2C5364] flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">
            Error Loading Level
          </h1>
          <p className="text-slate-300 mb-4">
            {error || "Level data not found"}
          </p>
          <button
            onClick={() => router.push(`/courses/${course}`)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
          >
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-[#0F2027] via-[#2C5364] to-[#2C5364] flex justify-center items-center p-4">
      <div className="flex justify-between items-center w-[99%] h-full pt-20 gap-4">
        {/* Left Panel - Theory and Content */}
        <div className="w-[49%] h-[96%] bg-gradient-to-b from-[#1e293b]/80 to-[#0f172a]/80 backdrop-blur-md border border-slate-600/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-slate-600/30">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold text-white">
                {levelData.levelTitle}
              </h1>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    levelData.difficulty === "Easy"
                      ? "bg-green-500/20 text-green-400"
                      : levelData.difficulty === "Medium"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {levelData.difficulty}
                </span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold">
                  +{levelData.xpReward} XP
                </span>
              </div>
            </div>
            <p className="text-slate-400 text-sm">
              Level {levelData.level || levelData.levelNumber || levelNumber} •{" "}
              {levelData.description || levelData.topic}
            </p>
            {levelData.isCompleted && (
              <div className="mt-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm inline-block">
                ✅ Completed • {levelData.xpEarned} XP earned
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Learning Content */}
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
              <h3 className="text-slate-200 font-semibold mb-3 flex items-center">
                📚 Learning Content
              </h3>
              <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                {levelData.textContent ||
                  levelData.description ||
                  "No content available for this level."}
              </div>
            </div>

            {/* Assignments Overview */}
            {levelData.assignments && levelData.assignments.length > 0 && (
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
                <h3 className="text-slate-200 font-semibold mb-3 flex items-center">
                  🎯 Assignments ({levelData.assignments.length})
                </h3>
                <div className="space-y-3">
                  {levelData.assignments.map((assignment, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedAssignment === idx
                          ? "bg-blue-500/20 border-blue-500/50"
                          : "bg-slate-700/30 border-slate-600/20 hover:bg-slate-700/50"
                      }`}
                      onClick={() => setSelectedAssignment(idx)}
                    >
                      <h4 className="text-slate-200 font-medium text-sm mb-1">
                        {idx + 1}. {assignment.title}
                      </h4>
                      <p className="text-slate-400 text-xs">
                        {assignment.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submission Result */}
            {submissionResult && (
              <div
                className={`p-4 rounded-lg border ${
                  submissionResult.success
                    ? "bg-green-500/10 border-green-500/30"
                    : "bg-red-500/10 border-red-500/30"
                }`}
              >
                <div className="flex items-center mb-2">
                  <span
                    className={`text-sm font-semibold ${
                      submissionResult.success
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {submissionResult.success
                      ? "✅ Assignment Completed!"
                      : "❌ Try Again"}
                  </span>
                  {submissionResult.xpEarned > 0 && (
                    <span className="ml-2 px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold">
                      +{submissionResult.xpEarned} XP
                    </span>
                  )}
                </div>
                <p className="text-slate-300 text-sm mb-2">
                  {submissionResult.message}
                </p>
                {submissionResult.hint && (
                  <div className="text-xs">
                    <span className="text-slate-400">💡 Hint:</span>
                    <p className="text-yellow-400 mt-1">
                      {submissionResult.hint}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Mini Boss */}
            {levelData.miniBoss && (
              <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30">
                <h3 className="text-purple-400 font-semibold mb-3">
                  ⚔️ Mini-Boss Challenge
                </h3>
                <h4 className="text-slate-200 font-medium text-sm mb-2">
                  {levelData.miniBoss.title}
                </h4>
                <p className="text-slate-300 text-sm mb-3">
                  {levelData.miniBoss.description}
                </p>
                <div className="text-sm">
                  <span className="text-slate-400">Requirements:</span>
                  <ul className="list-disc list-inside text-slate-300 mt-1 space-y-1">
                    {levelData.miniBoss.requirements.map((req, idx) => (
                      <li key={idx} className="text-xs">
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Big Boss */}
            {levelData.bigBoss && (
              <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/30">
                <h3 className="text-red-400 font-semibold mb-3">
                  🔥 Big Boss Challenge
                </h3>
                <h4 className="text-slate-200 font-medium text-sm mb-2">
                  {levelData.bigBoss.title}
                </h4>
                <p className="text-slate-300 text-sm mb-3">
                  {levelData.bigBoss.description}
                </p>
                <div className="text-sm">
                  <span className="text-slate-400">Requirements:</span>
                  <ul className="list-disc list-inside text-slate-300 mt-1 space-y-1">
                    {levelData.bigBoss.requirements.map((req, idx) => (
                      <li key={idx} className="text-xs">
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="p-4 border-t border-slate-600/30 flex justify-between">
            <button
              onClick={() => {
                if (levelData.previousLevel) {
                  router.push(
                    `/courses/${course}/level-${levelData.previousLevel.levelNumber}`
                  );
                } else {
                  router.push(`/courses/${course}`);
                }
              }}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm"
            >
              {levelData.previousLevel
                ? "← Previous Level"
                : "← Back to Course"}
            </button>

            {levelData.nextLevel && (
              <button
                onClick={() =>
                  router.push(
                    `/courses/${course}/level-${levelData.nextLevel.levelNumber}`
                  )
                }
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
              >
                Next Level →
              </button>
            )}
          </div>
        </div>

        {/* Right Panel - Code Runner */}
        <div className="w-[49%] h-[96%] bg-gradient-to-b from-[#1e293b]/80 to-[#0f172a]/80 backdrop-blur-md border border-slate-600/50 rounded-2xl shadow-2xl">
          <CodeRunner
            course={course}
            assignment={levelData.assignments?.[selectedAssignment]}
            levelTitle={levelData.levelTitle}
            onValidationResult={handleCodeSubmission}
          />
        </div>
      </div>
    </div>
  );
};

export default LevelPage;
