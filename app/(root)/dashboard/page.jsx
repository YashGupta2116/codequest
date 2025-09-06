"use client";
import React, { useState, useEffect } from "react";
import {
  FaFire,
  FaTrophy,
  FaStar,
  FaPlay,
  FaLock,
  FaCheck,
  FaArrowRight,
  FaClock,
  FaUsers,
  FaChevronRight,
  FaBolt,
  FaCode,
  FaGraduationCap,
} from "react-icons/fa";
import { SiPython, SiCplusplus } from "react-icons/si";
import { RiLineChartLine, RiSparklingFill } from "react-icons/ri";
import { IoTrendingUp, IoCodeSlash } from "react-icons/io5";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const [selectedPath, setSelectedPath] = useState("python");
  const [streak, setStreak] = useState(2);
const router = useRouter()
  const learningPaths = {
    python: {
      title: "Python Development",
      subtitle: "Backend & Data Science Track",
      icon: <SiPython className="text-3xl text-yellow-400" />,
      gradient: "from-yellow-400/20 to-orange-500/20",
      borderGradient: "from-yellow-400/50 to-orange-500/50",
      progress: 5,
      level: 1,
      totalHours: 1,
      studentsEnrolled: "12.5k",
      difficulty: "Beginner Friendly",
      skillPoints: 2400,
      chapters: [
        {
          id: 1,
          name: "Python Fundamentals",
          progress: 100,
          locked: false,
          duration: "4h",
          skillPoints: 200,
        },
        {
          id: 2,
          name: "Data Structures",
          progress: 100,
          locked: false,
          duration: "6h",
          skillPoints: 300,
        },
        {
          id: 3,
          name: "Functions & Modules",
          progress: 85,
          locked: false,
          duration: "5h",
          skillPoints: 250,
        },
        {
          id: 4,
          name: "Object-Oriented Programming",
          progress: 45,
          locked: false,
          duration: "7h",
          skillPoints: 400,
        },
        {
          id: 5,
          name: "Error Handling",
          progress: 0,
          locked: false,
          duration: "3h",
          skillPoints: 200,
        },
        {
          id: 6,
          name: "File Operations",
          progress: 0,
          locked: true,
          duration: "4h",
          skillPoints: 300,
        },
        {
          id: 7,
          name: "Web Development",
          progress: 0,
          locked: true,
          duration: "8h",
          skillPoints: 500,
        },
        {
          id: 8,
          name: "Data Analysis",
          progress: 0,
          locked: true,
          duration: "10h",
          skillPoints: 600,
        },
      ],
    },
    cpp: {
      title: "C++ Programming",
      subtitle: "System & Game Development",
      icon: <SiCplusplus className="text-3xl text-blue-400" />,
      gradient: "from-blue-400/20 to-purple-500/20",
      borderGradient: "from-blue-400/50 to-purple-500/50",
      progress: 2,
      level: 1,
      totalHours: 56,
      studentsEnrolled: "8.3k",
      difficulty: "Intermediate",
      skillPoints: 1200,
      chapters: [
        {
          id: 1,
          name: "C++ Basics",
          progress: 100,
          locked: false,
          duration: "5h",
          skillPoints: 250,
        },
        {
          id: 2,
          name: "Memory Management",
          progress: 80,
          locked: false,
          duration: "6h",
          skillPoints: 350,
        },
        {
          id: 3,
          name: "Pointers & References",
          progress: 25,
          locked: false,
          duration: "7h",
          skillPoints: 400,
        },
        {
          id: 4,
          name: "Classes & Objects",
          progress: 0,
          locked: false,
          duration: "8h",
          skillPoints: 450,
        },
        {
          id: 5,
          name: "Inheritance",
          progress: 0,
          locked: true,
          duration: "6h",
          skillPoints: 400,
        },
        {
          id: 6,
          name: "Templates",
          progress: 0,
          locked: true,
          duration: "7h",
          skillPoints: 500,
        },
        {
          id: 7,
          name: "STL Containers",
          progress: 0,
          locked: true,
          duration: "8h",
          skillPoints: 550,
        },
        {
          id: 8,
          name: "Advanced C++",
          progress: 0,
          locked: true,
          duration: "12h",
          skillPoints: 700,
        },
      ],
    },
    java: {
      title: "Java Enterprise",
      subtitle: "Web & Mobile Applications",
      icon: (
        <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
          J
        </div>
      ),
      gradient: "from-red-500/20 to-orange-500/20",
      borderGradient: "from-red-500/50 to-orange-500/50",
      progress: 3,
      level: 1,
      totalHours: 64,
      studentsEnrolled: "15.2k",
      difficulty: "Beginner Friendly",
      skillPoints: 800,
      chapters: [
        {
          id: 1,
          name: "Java Fundamentals",
          progress: 100,
          locked: false,
          duration: "6h",
          skillPoints: 300,
        },
        {
          id: 2,
          name: "Core Java Concepts",
          progress: 35,
          locked: false,
          duration: "8h",
          skillPoints: 400,
        },
        {
          id: 3,
          name: "Object-Oriented Design",
          progress: 0,
          locked: false,
          duration: "7h",
          skillPoints: 350,
        },
        {
          id: 4,
          name: "Collections Framework",
          progress: 0,
          locked: true,
          duration: "9h",
          skillPoints: 500,
        },
        {
          id: 5,
          name: "Exception Handling",
          progress: 0,
          locked: true,
          duration: "5h",
          skillPoints: 300,
        },
        {
          id: 6,
          name: "Multithreading",
          progress: 0,
          locked: true,
          duration: "10h",
          skillPoints: 600,
        },
        {
          id: 7,
          name: "Spring Framework",
          progress: 0,
          locked: true,
          duration: "15h",
          skillPoints: 800,
        },
        {
          id: 8,
          name: "Microservices",
          progress: 0,
          locked: true,
          duration: "18h",
          skillPoints: 1000,
        },
      ],
    },
  };

  const currentPath = learningPaths[selectedPath];

  const weeklyProgress = [
    { day: "Mon", hours: 2.5 },
    { day: "Tue", hours: 3.2 },
    { day: "Wed", hours: 1.8 },
    { day: "Thu", hours: 4.1 },
    { day: "Fri", hours: 2.9 },
    { day: "Sat", hours: 3.7 },
    { day: "Sun", hours: 2.3 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F2027] via-[#2C5364] to-[#2C5364] text-white">
      <div className="max-w-7xl mx-auto px-6 py-8 pt-20">
        {/* Hero Section */}
        <div className="mb-10">
          <div className="relative overflow-hidden bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-orange-500/20 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-full blur-2xl"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 px-4 py-2 rounded-full border border-orange-500/30 mb-6">
                    <RiSparklingFill className="text-orange-400" />
                    <span className="text-sm font-semibold text-orange-300">
                      Welcome back to your learning journey
                    </span>
                  </div>

                  <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight">
                    Master{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                      Code
                    </span>
                    <br />
                    Build{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                      Future
                    </span>
                  </h1>

                  <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl">
                    Transform your programming skills with interactive
                    challenges, real-world projects, and expert guidance. Your
                    next breakthrough is just one lesson away.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <button onClick={()=>{router.push("/courses")}} className="group bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25">
                      <div className="flex items-center space-x-2">
                        <span>Continue Learning</span>
                        <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>

                    <button onClick={()=>{router.push("/courses")}} className="px-8 py-4 rounded-xl font-semibold text-lg border-2 border-white/20 hover:border-white/40 transition-all duration-300 hover:bg-white/5">
                      View Progress
                    </button>
                  </div>
                </div>

                <div className="hidden xl:block">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                      <div className="text-3xl font-bold text-orange-400 mb-1">
                        12h
                      </div>
                      <div className="text-sm text-gray-300">Hours Learned</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                      <div className="text-3xl font-bold text-blue-400 mb-1">
                        89%
                      </div>
                      <div className="text-sm text-gray-300">
                        Completion Rate
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Learning Paths Selection */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Learning Paths</h2>
                  <p className="text-gray-400">
                    Choose your specialization and start mastering new skills
                  </p>
                </div>
                <button className="flex items-center space-x-2 text-orange-400 hover:text-orange-300 transition-colors">
                  <span className="text-sm font-medium">Explore All</span>
                  <FaChevronRight className="text-xs" />
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-10">
                {Object.entries(learningPaths).map(([key, path]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedPath(key)}
                    className={`group relative p-6 rounded-2xl border-2 transition-all duration-500 ${
                      selectedPath === key
                        ? `bg-gradient-to-br ${path.gradient} border-transparent shadow-2xl scale-105 shadow-orange-500/10`
                        : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
                    }`}
                  >
                    <div className="text-left">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                          {path.icon}
                        </div>
                        <div className="text-xs font-semibold text-gray-400 bg-gray-800/50 px-2 py-1 rounded-md">
                          Level {path.level}
                        </div>
                      </div>

                      <h3 className="text-xl font-bold mb-1">{path.title}</h3>
                      <p className="text-sm text-gray-400 mb-4">
                        {path.subtitle}
                      </p>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-300">Progress</span>
                          <span className="font-bold">{path.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-800/50 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full bg-gradient-to-r ${path.borderGradient.replace(
                              "/50",
                              ""
                            )} transition-all duration-1000 ease-out`}
                            style={{ width: `${path.progress}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>{path.studentsEnrolled} enrolled</span>
                          <span>{path.totalHours} hours</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Current Course Details */}
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-6">
                  <div
                    className={`p-4 bg-gradient-to-br ${currentPath.gradient} rounded-2xl border border-white/20 backdrop-blur-sm`}
                  >
                    {currentPath.icon}
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold mb-2">
                      {currentPath.title}
                    </h3>
                    <p className="text-gray-400 mb-3">{currentPath.subtitle}</p>
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="flex items-center space-x-2 bg-gray-800/30 px-3 py-1 rounded-full">
                        <FaClock className="text-orange-400" />
                        <span>{currentPath.totalHours} hours</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-gray-800/30 px-3 py-1 rounded-full">
                        <FaUsers className="text-blue-400" />
                        <span>{currentPath.studentsEnrolled} students</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-gray-800/30 px-3 py-1 rounded-full">
                        <FaBolt className="text-yellow-400" />
                        <span>{currentPath.skillPoints} SP</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  className={`bg-gradient-to-r ${currentPath.borderGradient.replace(
                    "/50",
                    ""
                  )} hover:shadow-lg px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105`}
                >
                  <div className="flex items-center space-x-2">
                    <FaPlay />
                    <span>Continue</span>
                  </div>
                </button>
              </div>

              {/* Progress Overview */}
              <div className="bg-gradient-to-r from-gray-800/30 to-gray-900/20 p-6 rounded-2xl mb-8 border border-white/5">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Course Progress</span>
                  <div className="text-right">
                    <span className="text-3xl font-bold">
                      {currentPath.progress}%
                    </span>
                    <div className="text-sm text-gray-400">Complete</div>
                  </div>
                </div>
                <div className="w-full bg-gray-800/50 rounded-full h-3 mb-2">
                  <div
                    className={`h-3 rounded-full bg-gradient-to-r ${currentPath.borderGradient.replace(
                      "/50",
                      ""
                    )} transition-all duration-1000 ease-out shadow-md`}
                    style={{ width: `${currentPath.progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-400">
                  {Math.round(
                    (currentPath.progress / 100) * currentPath.totalHours
                  )}{" "}
                  of {currentPath.totalHours} hours completed
                </p>
              </div>

              {/* Course Modules */}
              <div>
                <h4 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                  <IoCodeSlash className="text-orange-400" />
                  <span>Course Modules</span>
                </h4>
                <div className="space-y-4">
                  {currentPath.chapters.map((chapter) => (
                    <div
                      key={chapter.id}
                      className={`group p-5 rounded-2xl border transition-all duration-300 ${
                        chapter.locked
                          ? "bg-gray-900/20 border-gray-700/30 opacity-60"
                          : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10 cursor-pointer"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              chapter.progress === 100
                                ? "bg-green-500 shadow-lg shadow-green-500/25"
                                : chapter.progress > 0
                                ? `bg-gradient-to-br ${currentPath.gradient} shadow-lg`
                                : chapter.locked
                                ? "bg-gray-700"
                                : "bg-gray-800/50 group-hover:bg-gray-700/50"
                            } transition-all duration-300`}
                          >
                            {chapter.progress === 100 ? (
                              <FaCheck className="text-white" />
                            ) : chapter.locked ? (
                              <FaLock className="text-gray-400" />
                            ) : (
                              <span className="font-bold text-white">
                                {chapter.id}
                              </span>
                            )}
                          </div>

                          <div className="flex-1">
                            <h5 className="text-lg font-semibold mb-1">
                              {chapter.name}
                            </h5>
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                              <span>{chapter.duration}</span>
                              <span>+{chapter.skillPoints} SP</span>
                              {!chapter.locked && chapter.progress > 0 && (
                                <span className="text-orange-400 font-medium">
                                  {chapter.progress}% done
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          {!chapter.locked &&
                            chapter.progress > 0 &&
                            chapter.progress < 100 && (
                              <div className="w-20 bg-gray-700/50 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full bg-gradient-to-r ${currentPath.borderGradient.replace(
                                    "/50",
                                    ""
                                  )} transition-all duration-500`}
                                  style={{ width: `${chapter.progress}%` }}
                                ></div>
                              </div>
                            )}
                          {!chapter.locked && (
                            <FaChevronRight className="text-gray-400 group-hover:text-orange-400 transition-colors" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Performance Stats */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl">
              <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
                <IoTrendingUp className="text-green-400" />
                <span>Your Performance</span>
              </h3>

              <div className="space-y-6">
                <div className="p-5 bg-gradient-to-r from-orange-500/20 to-red-500/10 rounded-xl border border-orange-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <FaFire className="text-orange-400 text-xl" />
                      <span className="font-semibold">Learning Streak</span>
                    </div>
                    <span className="text-2xl font-bold text-orange-400">
                      {streak}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">Days in a row</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                    <FaStar className="text-yellow-400 text-2xl mx-auto mb-2" />
                    <div className="text-lg font-bold">1000</div>
                    <div className="text-xs text-gray-400">Skill Points</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                    <FaTrophy className="text-yellow-400 text-2xl mx-auto mb-2" />
                    <div className="text-lg font-bold">#47</div>
                    <div className="text-xs text-gray-400">Global Rank</div>
                  </div>
                </div>
              </div>
            </div>
{/* Quotes Section */}
<div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl">
    <h3 className="text-xl font-bold mb-6">Motivational Quotes</h3>
    <div className="space-y-4 text-gray-300 italic">
        <p>“The expert in anything was once a beginner.”</p>
        <p>“Don’t watch the clock; do what it does. Keep going.”</p>
        <p>“Every line of code you write makes you better.”</p>
    </div>
</div>

            {/* Quick Actions */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl">
              <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <button onClick={()=>{router.push("/courses")}} className="w-full text-left p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 border border-white/10 hover:border-white/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FaCode className="text-blue-400" />
                      <span  className="font-medium">Practice Problems</span>
                    </div>
                    <FaChevronRight className="text-gray-400" />
                  </div>
                </button>

                <button className="w-full text-left p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 border border-white/10 hover:border-white/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FaGraduationCap className="text-green-400" />
                      <span className="font-medium">View Certificates</span>
                    </div>
                    <FaChevronRight className="text-gray-400" />
                  </div>
                </button>

                <button onClick={()=>{router.push("/courses")}} className="w-full text-left p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 border border-white/10 hover:border-white/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <RiLineChartLine className="text-purple-400" />
                      <span className="font-medium">Progress Report</span>
                    </div>
                    <FaChevronRight className="text-gray-400" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;