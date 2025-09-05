"use client";
import React, { useState, useEffect } from "react";
import { getAllUserRoadmaps, getRoadmapStats } from "@/actions/getRoadmap";

const MyRoadmapsPage = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [roadmapsData, statsData] = await Promise.all([
          getAllUserRoadmaps(),
          getRoadmapStats(),
        ]);
        setRoadmaps(roadmapsData);
        setStats(statsData);
      } catch (error) {
        console.error("Error loading roadmaps:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F2027] via-[#2C5364] to-[#2C5364] flex items-center justify-center">
        <div className="text-white text-xl">Loading your roadmaps...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F2027] via-[#2C5364] to-[#2C5364] p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">
          My Learning Roadmaps
        </h1>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-[#1e293b]/80 backdrop-blur-md rounded-xl p-6 border border-slate-600/50">
              <h3 className="text-slate-300 text-sm mb-2">Total XP</h3>
              <p className="text-3xl font-bold text-yellow-400">
                {stats.totalXp}
              </p>
            </div>
            <div className="bg-[#1e293b]/80 backdrop-blur-md rounded-xl p-6 border border-slate-600/50">
              <h3 className="text-slate-300 text-sm mb-2">Languages</h3>
              <p className="text-3xl font-bold text-blue-400">
                {stats.totalRoadmaps}
              </p>
            </div>
            <div className="bg-[#1e293b]/80 backdrop-blur-md rounded-xl p-6 border border-slate-600/50">
              <h3 className="text-slate-300 text-sm mb-2">Levels Completed</h3>
              <p className="text-3xl font-bold text-green-400">
                {stats.completedLevels}/{stats.totalLevels}
              </p>
            </div>
            <div className="bg-[#1e293b]/80 backdrop-blur-md rounded-xl p-6 border border-slate-600/50">
              <h3 className="text-slate-300 text-sm mb-2">Progress</h3>
              <p className="text-3xl font-bold text-purple-400">
                {stats.progressPercentage}%
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roadmaps.map((roadmap) => (
            <div
              key={roadmap.id}
              className="bg-[#1e293b]/80 backdrop-blur-md rounded-xl p-6 border border-slate-600/50"
            >
              <h2 className="text-2xl font-bold text-white mb-2">
                {roadmap.title}
              </h2>
              <p className="text-slate-300 mb-4">{roadmap.language}</p>

              <div className="mb-4">
                <div className="flex justify-between text-sm text-slate-400 mb-2">
                  <span>Progress</span>
                  <span>
                    {roadmap.completedLevels}/{roadmap.totalLevels}
                  </span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        (roadmap.completedLevels / roadmap.totalLevels) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">
                  {roadmap.totalLevels} levels
                </span>
                <a
                  href={`/courses/${roadmap.language.toLowerCase()}`}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Continue
                </a>
              </div>
            </div>
          ))}
        </div>

        {roadmaps.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-white mb-4">
              No Roadmaps Yet
            </h2>
            <p className="text-slate-300 mb-6">
              Start learning by clicking on a course card!
            </p>
            <a
              href="/courses"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Browse Courses
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRoadmapsPage;
