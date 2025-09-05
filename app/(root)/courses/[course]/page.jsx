"use client";
import React, { useState, use } from "react";
import Levelcard from "@/components/Levelcard";
import { useRouter } from "next/navigation";

const CoursePage = ({ params }) => {
  const [currentidx, setCurrentidx] = useState(null);
  const [currentLevel, setcurrentLevel] = useState(0);
  const { course } = use(params);
  const router = useRouter();

  const leveldata = [
    {
      level: 1,
      description: "Variables, Data Types, Literals",
      status: 35,
      title: "Level 1: Variables",
    },
    {
      level: 2,
      description: "Operators, Expressions, Type Casting",
      status: 20,
      title: "Level 2: Operators",
    },
    {
      level: 3,
      description: "Conditional Statements (if, elif, else)",
      status: 45,
      title: "Level 3: Conditionals",
    },
    {
      level: 4,
      description: "Loops (for, while, nested)",
      status: 60,
      title: "Level 4: Loops",
    },
    {
      level: 5,
      description: "Functions, Parameters, Return Values",
      status: 30,
      title: "Level 5: Functions",
    },
    {
      level: 6,
      description: "Lists, Tuples, Sets, Dictionaries",
      status: 25,
      title: "Level 6: Collections",
    },
    {
      level: 7,
      description: "String Handling & Methods",
      status: 55,
      title: "Level 7: Strings",
    },
    {
      level: 8,
      description: "File Handling (read, write, append)",
      status: 40,
      title: "Level 8: File Handling",
    },
    {
      level: 9,
      description: "Modules & Libraries (import, pip)",
      status: 15,
      title: "Level 9: Modules",
    },
    {
      level: 10,
      description: "OOP (Classes, Objects, Inheritance)",
      status: 10,
      title: "Level 10: OOP",
    },
  ];

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
          {!currentidx && (
            <div className="text-center flex-1 flex flex-col justify-center items-center px-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-4 leading-tight">
                Welcome to CodeQuest 🚀
              </h1>
              <p className="text-slate-300 text-sm sm:text-lg max-w-md">
                Start learning{" "}
                <span className="text-yellow-400 font-semibold">{course}</span>{" "}
                step by step.
              </p>
              <p className="text-slate-400 text-xs sm:text-sm mt-3 lg:hidden">
                Select a level above to begin
              </p>
            </div>
          )}

          {currentidx && (
            <div className="flex flex-col justify-between flex-1 min-h-0">
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4 leading-tight">
                  {currentidx.title}
                </h1>
                <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed">
                  {currentidx.description}
                </p>

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
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 sm:h-3 rounded-full transition-all duration-500"
                      style={{ width: `${currentidx.status}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6 sm:mt-8">
                <button
                  onClick={() => {
                    router.push(`/courses/${course}/level-${currentLevel}`);
                  }}
                  className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-sm sm:text-base rounded-xl shadow-md transition-all duration-300"
                >
                  Start Learning
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
