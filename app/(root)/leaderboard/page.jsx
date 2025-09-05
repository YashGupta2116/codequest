"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaCrown, FaChevronUp, FaSearch } from "react-icons/fa";
import { BsTrophyFill } from "react-icons/bs";


const leaderboard = [
  {
    name: "Rohit Sharma",
    username: "rohit007",
    avatar: "/images/boy.png",
    points: 3520,
    level: 19,
  },
  {
    name: "Alka Verma",
    username: "alkaverse",
    avatar: "/images/girl.png",
    points: 3455,
    level: 18,
  },
  {
    name: "Aayush Rana",
    username: "ayush_dev",
    avatar: "/images/boy.png",
    points: 3410,
    level: 18,
  },
  {
    name: "Niharika Gupta",
    username: "nikigupta",
    avatar: "/images/girl.png",
    points: 3112,
    level: 17,
  },
  {
    name: "Piyush Chawla",
    username: "pi-coder",
    avatar: "/images/boy.png",
    points: 3019,
    level: 16,
  },
  {
    name: "Tanvi Singh",
    username: "tanvitech",
    avatar: "/images/girl.png",
    points: 2925,
    level: 15,
  },
];

const trophyGradients = [
  "from-amber-400 via-orange-400 to-yellow-300",
  "from-slate-400 via-blue-400 to-cyan-200",
  "from-green-300 via-green-400 to-green-400", 
];

export default function LeaderBoardPage() {
  const [search, setSearch] = useState("");
  const filteredLeaderboard = leaderboard.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0F2027] via-[#2C5364] to-[#2C5364] text-white font-sans overflow-x-hidden flex flex-col">

      
      <header className="w-full mt-20 py-14 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="text-7xl md:text-8xl font-black tracking-tight select-none"
        >
          <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-emerald-400 bg-clip-text text-transparent text-20xl">Leaderboard</span>
        </motion.h1>
        <div className="mt-4 text-lg text-slate-300 font-light">
          See who’s topping CodeQuest this week!
        </div>
      </header>
      
      
      <div className="flex items-center justify-center mt-2 mb-12">
        <div className="flex items-center bg-[#182b39] rounded-full px-5 py-3 w-full max-w-md shadow-inner ring-1 ring-blue-800/20">
          <FaSearch className="mr-3 text-cyan-400 text-lg" />
          <input
            type="search"
            className="w-full bg-transparent text-white placeholder:font-light focus:outline-none"
            placeholder="Search by name or username..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      
      <section className="mx-auto mb-20 flex items-end justify-center gap-8 max-w-4xl w-full px-8">
        {[1, 0, 2].map((idx, order) => {
          const user = filteredLeaderboard[idx];
          return user ? (
            <motion.div
              key={user.username}
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: order * 0.1 }}
              className={`flex flex-col items-center justify-end rounded-2xl
                ${order === 1 ? "scale-110 z-10" : "opacity-95"}
                bg-gradient-to-br ${
                  trophyGradients[idx]
                } bg-clip-padding px-8 pb-8 pt-4 shadow-2xl`}
              style={{
                minHeight: order === 1 ? 230 : 150,
                marginBottom: order === 1 ? 0 : 50,
              }}
            >
              
              <div className={`w-20 h-20 rounded-full border-4 ${order === 1 ? "border-white" : "border-slate-200"} overflow-hidden bg-white mb-2`}>
                <img
                  src={user.avatar}
                  className="object-cover w-full h-full"
                  alt={user.name}
                />
              </div>
              
              <div className="flex items-center gap-1">
                <span className={`text-lg font-bold ${idx === 0 ? "text-yellow-300" : idx === 1 ? "text-gray-200" : "text-amber-600"}`}>
                  {user.name.split(" ")[0]}
                </span>
                {order === 1 && <FaCrown className="ml-1 text-2xl text-amber-300 drop-shadow-lg" />}
              </div>
              <span className="text-xs text-white/80 mt-1">@{user.username}</span>
              <div className="flex items-center mt-2">
                <span className="bg-black/30 rounded-full px-3 py-1 text-sm text-white mr-1">Level {user.level}</span>
                <span className="bg-black/10 rounded-full px-3 py-1 text-sm text-white ml-1 font-bold">
                  <BsTrophyFill className="inline-block text-yellow-300 mr-1" />
                  {user.points} pts
                </span>
              </div>
            </motion.div>
          ) : null;
        })}
      </section>

      
      <section className="flex-1 w-full max-w-5xl mx-auto px-3 pb-20">
        <div className="rounded-2xl overflow-hidden shadow-xl bg-[#1C293A]/80">
          <table className="w-full text-left">
            <thead className="bg-gradient-to-r from-[#253147] to-[#2C5364]">
              <tr>
                <th className="py-4 px-4 text-lg font-bold tracking-wider text-cyan-300">Rank</th>
                <th className="py-4 px-4 text-lg font-bold tracking-wider">Player</th>
                <th className="py-4 px-4 text-lg font-bold tracking-wider">Level</th>
                <th className="py-4 px-4 text-lg font-bold tracking-wider">Points</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaderboard.map((user, i) => (
                <motion.tr
                  key={user.username}
                  initial={{ opacity: 0, translateY: 30 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ delay: 0.1 + i * 0.04 }}
                  className={`border-b border-slate-800 ${i < 3 ? "bg-[#223148]/80" : ""}`}
                >
                  <td className="py-3 px-4 font-extrabold text-xl text-cyan-400">
                    {i + 1}
                  </td>
                  <td className="py-3 px-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700/40 border-2 border-slate-800">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="font-semibold">{user.name}</span>
                      <div className="text-sm text-slate-300 opacity-80">@{user.username}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-bold text-emerald-300">Lv. {user.level}</td>
                  <td className="py-3 px-4 font-bold text-yellow-300">{user.points}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
