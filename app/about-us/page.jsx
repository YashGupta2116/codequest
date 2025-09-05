"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaDiscord, FaGithub, FaLinkedin } from "react-icons/fa";
import Navbar from "@/components/Navbar";

const features = [
    {
        title: "Gamified Learning",
        desc: "Turn coding into an exciting adventure! Each challenge feels like a game level, keeping learners hooked.",
    },
    {
        title: "Earn XP & Rewards",
        desc: "Collect XP points by solving problems, complete levels, and unlock exciting badges and achievements.",
    },
    {
        title: "Leaderboards",
        desc: "Stay motivated by competing with friends and other learners worldwide on interactive leaderboards.",
    },
    {
        title: "Fun Courses",
        desc: "Learn different programming languages step by step with interactive lessons designed for beginners.",
    },
];

// Team Data
const team = [
    {
        name: "Hardik Dhameeja",
        role: "FullStack Developer",
        image: "/images/hardik.jpg",
        socials: {
            discord: "https://discordapp.com/users/869873443649253446",
            github: "https://github.com/hardik211005",
            linkedin: "https://www.linkedin.com/in/hardik-dhameeja-9700192b0/",
        },
    },
    {
        name: "Yash Gupta",
        role: "FullStack Developer",
        image: "/images/yash.jpg",
        socials: {
            discord: "https://discordapp.com/users/1147882311803740170",
            github: "https://github.com/YashGupta2116",
            linkedin: "https://www.linkedin.com/in/yashgupta2116/",
        },
    },
    {
        name: "Aryan Luthra",
        role: "Fullstack Developer",
        image: "/images/aryan.jpg",
        socials: {
            discord: "https://discordapp.com/users/726791149569835091",
            github: "https://github.com/Aryanluthra1911",
            linkedin: "https://www.linkedin.com/in/aryanluthra1911/",
        },
    },
];

const AboutPage = () => {
    return (
        <div className=" flex justify-center items-center flex-col min-h-screen w-full max-w-full overflow-x-hidden bg-gradient-to-br from-[#0F2027] via-[#2C5364] to-[#2C5364] text-white">
            {/* Navbar */}
            <Navbar />
            
            {/* Main Content Container */}
            <div className="flex items-start justify-center px-4 py-6 w-[90%] max-w-full">
                {/* Dark Glass Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-[calc(100vw-2rem)] bg-[#0F2027]/70 backdrop-blur-xl rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.6)] border border-white/5 p-6 relative overflow-hidden"
                >
                    {/* Glow Background */}
                    <div className="absolute -top-28 -left-28 w-96 h-96 bg-cyan-500/10 rounded-full blur-[180px]"></div>
                    <div className="absolute -bottom-28 -right-28 w-96 h-96 bg-purple-500/10 rounded-full blur-[180px]"></div>
                    
                    <div className="relative z-10">
                        {/* Heading */}
                        <motion.h1
                            initial={{ y: -30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6 }}
                            className="text-4xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-400 bg-clip-text text-transparent drop-shadow-lg"
                        >
                            About CodeQuest
                        </motion.h1>
                        
                        {/* Paragraph */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="mt-5 text-sm md:text-base text-gray-300 leading-relaxed max-w-3xl mx-auto text-center"
                        >
                            <span className="font-bold text-white">CodeQuest</span> isn't just a
                            learning app — it's a{" "}
                            <span className="text-cyan-400 font-medium">journey</span>. We
                            believe learning should feel like{" "}
                            <span className="text-pink-400 font-medium">gaming</span> — full of
                            XP, achievements, and leaderboards. From beginner to advanced
                            coders, CodeQuest keeps curiosity alive and makes coding feel like
                            an epic quest. 🚀
                        </motion.p>
                        
                        {/* Features */}
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.15, duration: 0.5 }}
                                    whileHover={{ scale: 1.03 }}
                                    className="bg-[#1A2A33]/80 border border-white/5 rounded-2xl p-4 backdrop-blur-md transition-all duration-50 shadow-[0_0_20px_rgba(0,0,0,0.4)] hover:shadow-[0_0_30px_rgba(0,255,255,0.1)] hover:border-cyan-500/20"
                                >
                                    <h3 className="text-lg md:text-xl font-semibold text-cyan-300 mb-1.5">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        {feature.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                        
                        {/* Team Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                            className="mt-10"
                        >
                            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
                                👥 Meet the Team
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                {team.map((member, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.15, duration: 0.5 }}
                                        whileHover={{ scale: 1.03 }}
                                        className="bg-[#1A2A33]/80 border border-white/5 rounded-2xl p-4 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.4)] transition-all duration-150 hover:shadow-[0_0_30px_rgba(0,255,255,0.1)] hover:border-cyan-500/20"
                                    >
                                        <div className="flex items-center gap-4">
                                            {/* Photo Placeholder */}
                                            <div className="flex-shrink-0">
                                                {member.image ? (
                                                    <img
                                                        src={member.image}
                                                        alt={member.name}
                                                        className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400/30 transition-all duration-150 hover:border-cyan-400/50"
                                                    />
                                                ) : (
                                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400/20 to-purple-400/20 border-2 border-cyan-400/30 flex items-center justify-center transition-all duration-150 hover:border-cyan-400/50">
                                                        <span className="text-lg font-bold text-cyan-300">
                                                            {member.name.split(' ').map(n => n[0]).join('')}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Content */}
                                            <div className="text-left flex-grow">
                                                <h3 className="text-base md:text-lg font-semibold text-cyan-300 mb-1">
                                                    {member.name}
                                                </h3>
                                                <p className="text-gray-400 text-sm mb-2">{member.role}</p>
                                                
                                                {/* Social Icons */}
                                                <div className="flex gap-3">
                                                    <a 
                                                        href={member.socials.discord} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="text-cyan-400 hover:text-cyan-300 hover:scale-110 transition-all duration-150"
                                                    >
                                                        <FaDiscord size={18} />
                                                    </a>
                                                    <a 
                                                        href={member.socials.github} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="text-gray-300 hover:text-white hover:scale-110 transition-all duration-150"
                                                    >
                                                        <FaGithub size={18} />
                                                    </a>
                                                    <a 
                                                        href={member.socials.linkedin} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="text-blue-400 hover:text-blue-300 hover:scale-110 transition-all duration-150"
                                                    >
                                                        <FaLinkedin size={18} />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AboutPage;
