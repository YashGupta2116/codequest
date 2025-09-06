"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import getData from "@/actions/getData";

const CourseCard = ({ course }) => {
  const { title, lessons, rating, enrolled, duration, lastupdated, src } =
    course || {};
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleClick = async () => {
    if (!course || !title || loading) return;
    try {
      setLoading(true);
      const language = String(title);
      console.log("🎯 CourseCard clicked - Language:", language);
      const response = await getData(language);
      if (response) {
        try {
          localStorage.setItem(
            `roadmap:${language.toLowerCase()}`,
            JSON.stringify(response)
          );
        } catch (_) {}
      }
      router.push(`/courses/${title.toLowerCase()}`);
    } catch (err) {
      console.error("Failed to fetch roadmap:", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-[#13252d] rounded-2xl p-8 max-w-md w-full mx-4 border border-slate-700">
            {/* Multi-step Loading Animation */}
            <div className="text-center">
              <div className="relative mb-6">
                {/* Spinning Circle */}
                <div className="w-16 h-16 mx-auto mb-4">
                  <div className="w-full h-full border-4 border-slate-600 rounded-full animate-spin border-t-blue-500"></div>
                </div>
                
                {/* Loading Steps */}
                <div className="space-y-2 text-sm text-slate-300">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span>Initializing {title} course...</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-100"></div>
                    <span>Loading roadmap data...</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-200"></div>
                    <span>Preparing lessons...</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse delay-300"></div>
                    <span>Almost ready...</span>
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-slate-700 rounded-full h-2 mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse" 
                    style={{ width: '75%' }}></div>
              </div>
              
              <p className="text-slate-400 text-xs">
                Please wait while we set up your learning journey...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Course Card */}
      <div
        onClick={handleClick}
        className={`w-[90%] sm:w-[48%] lg:w-[31%] xl:w-[22%] h-35 rounded-xl border border-slate-700 bg-[#13252d] p-4 text-slate-200 flex flex-col justify-around transition-all duration-200 ${
          loading 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:bg-[#1a2f38] hover:border-slate-600 cursor-pointer hover:scale-105'
        }`}
        role="button"
        aria-busy={loading}
      >
        <div className="w-full h-[85%] flex justify-around">
          <div className="w-[80%] h-full">
            <div className="text-xl font-semibold">Learn {title}</div>
          </div>
          <div className="w-[20%] h-full flex justify-end">
            <img src={src} alt="" className="w-12 h-12" />
          </div>
        </div>
        <div className="h-[15%] w-full flex gap-2">
          <div className="flex text-xs text-[#9a9a9a] h-full w-[40%] items-center gap-1">
            <img src="/clock.svg" alt="" className="h-3 w-3" />
            {duration} hours
          </div>
          <div className="flex text-xs text-[#9a9a9a] h-full w-[40%] items-center justify-end">
            {lastupdated}
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseCard;
