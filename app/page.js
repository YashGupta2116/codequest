"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion"; // Animation ke liye

const features = [
  {
    title: "Gamified Practice",
    desc: "Turn your programming journey into immersive gaming experiences with milestones and XP.",
    icon: "🎮",
    gradient: "from-purple-500/20 to-indigo-500/10",
    iconBg: "bg-purple-500",
  },
  {
    title: "AI-Powered Challenges",
    desc: "Adaptive, level-based exercises designed for efficient learning.",
    icon: "⚡",
    gradient: "from-blue-500/20 to-cyan-500/10",
    iconBg: "bg-blue-500",
  },
  {
    title: "Real-World Projects",
    desc: "Build portfolio-ready applications to prepare for real developer roles.",
    icon: "🏆",
    gradient: "from-amber-500/20 to-yellow-500/10",
    iconBg: "bg-amber-500",
  },
  {
    title: "Global Leaderboard",
    desc: "Track your progress and compete globally for ultimate motivation.",
    icon: "🌟",
    gradient: "from-emerald-500/20 to-teal-500/10",
    iconBg: "bg-emerald-500",
  },
];

const typingWords = [
  "Learn to code better.",
  "Conquer programming challenges.",
  "Level up your skills with CodeQuest.",
];

function TypingAnimation({ words, speed = 120, pause = 1800 }) {
  const [displayed, setDisplayed] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let timeout;
    const currentWord = words[wordIndex];

    if (!deleting && charIndex <= currentWord.length) {
      timeout = setTimeout(() => {
        setDisplayed(currentWord.substring(0, charIndex));
        setCharIndex((prev) => prev + 1);
      }, speed);
    } else if (deleting && charIndex >= 0) {
      timeout = setTimeout(() => {
        setDisplayed(currentWord.substring(0, charIndex));
        setCharIndex((prev) => prev - 1);
      }, speed / 2);
    } else if (charIndex > currentWord.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (charIndex < 0) {
      setDeleting(false);
      setWordIndex((prev) => (prev + 1) % words.length);
      setCharIndex(0);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, deleting, wordIndex, words, speed, pause]);

  return (
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-500 to-emerald-400 font-medium">
      {displayed}
      <span className="inline-block w-1 h-8 bg-purple-400 ml-1 rounded-full animate-pulse" />
    </span>
  );
}

export default function Homepage() {
  const router = useRouter();
  const handleStartQuest = () => {
    console.log("Starting quest...");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/3 rounded-full blur-3xl"></div>
      </div>

      {/* Decorative Code Symbols */}
      <div className="absolute top-16 left-8 text-slate-700/30 text-6xl font-mono">
        {"< >"}
      </div>
      <div className="absolute top-32 right-12 text-slate-700/30 text-7xl font-mono">
        {"{ }"}
      </div>
      <div className="absolute bottom-32 left-16 text-slate-700/30 text-5xl font-mono">
        {"[ ]"}
      </div>
      <div className="absolute bottom-16 right-20 text-slate-700/30 text-7xl font-mono">
        {"( )"}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        {/* Hero Section */}
        <div className="text-center max-w-5xl mx-auto">
          {/* 🔹 Large Logo with animation (center-top with spacing) */}
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex justify-center mb-10 mt-12"
          >
            <Image
              src="/logo.png"
              alt="CodeQuest Logo"
              width={130}
              height={130}
              className="mx-auto drop-shadow-xl animate-[fadeInScale_1s_ease-out]"
            />
          </motion.div>

          {/* Main Title */}
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-black mb-6 leading-none">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-500 to-emerald-400 drop-shadow-2xl">
              CodeQuest
            </span>
          </h1>

          {/* Subtitle with typing animation */}
          <div className="text-2xl md:text-3xl lg:text-4xl h-16 flex items-center justify-center">
            <TypingAnimation words={typingWords} speed={100} pause={1500} />
          </div>

          {/* Description */}
          <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Transform your programming skills through gamified learning,
            AI-powered challenges, and real-world projects.
          </p>

          {/* CTA Button */}
          <button
            onClick={handleStartQuest}
            className="group relative inline-flex items-center justify-center px-12 py-4 text-lg font-bold text-white bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 rounded-full shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/25"
          >
            <span className="relative z-10">Start Your Quest</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-blue-700 to-emerald-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="ml-2 text-xl group-hover:translate-x-1 transition-transform duration-300">
              🚀
            </span>
          </button>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-16 mb-20">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-1">
                50k+
              </div>
              <div className="text-sm text-slate-500">Active Learners</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-1">1M+</div>
              <div className="text-sm text-slate-500">Challenges Solved</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-1">
                95%
              </div>
              <div className="text-sm text-slate-500">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
                CodeQuest
              </span>
              ?
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Experience programming education like never before with our
              innovative approach
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className={`group relative p-8 rounded-2xl bg-gradient-to-br ${feature.gradient} border border-slate-700/50 backdrop-blur-sm hover:border-slate-600/70 transition-all duration-500 hover:scale-105 hover:shadow-xl cursor-pointer`}
              >
                {/* Icon */}
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 ${feature.iconBg} rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-4 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-500 transition-all duration-300">
                  {feature.title}
                </h3>

                <p className="text-slate-400 leading-relaxed text-sm group-hover:text-slate-300 transition-colors duration-300">
                  {feature.desc}
                </p>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-32 text-center">
          <div className="inline-flex items-center space-x-2 bg-slate-800/50 backdrop-blur-sm px-6 py-3 rounded-full border border-slate-700/50 mb-8">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-300">
              Join thousands of developers worldwide
            </span>
          </div>

          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-emerald-400">
              Level Up
            </span>
            ?
          </h3>

          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            Your coding adventure awaits. Start building, learning, and
            achieving your goals today.
          </p>

          <button
            onClick={handleStartQuest}
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg font-semibold hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
          >
            <span>Begin Journey</span>
            <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">
              →
            </span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-20 py-8 border-t border-slate-800/50 text-center">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-slate-500 text-sm">
            © 2025 CodeQuest. Crafted with ❤️ by package.json team.
          </p>
        </div>
      </footer>
    </div>
  );
}
