"use client";
import Navbar from "@/components/Navbar";
import CourseCard from "@/components/CourseCard";
import React from "react";

const page = () => {
  const coursedata = [
    {
      title: "Python",
      lessons: "179",
      rating: "4.8",
      enrolled: "420000",
      duration: "30",
      lastupdated: "Sept 2025",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    },
    {
      title: "Javascript",
      lessons: "179",
      rating: "4.8",
      enrolled: "420000",
      duration: "30",
      lastupdated: "Sept 2025",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    },
    {
      title: "Python",
      lessons: "179",
      rating: "4.8",
      enrolled: "420000",
      duration: "30",
      lastupdated: "Sept 2025",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    },
    {
      title: "Python",
      lessons: "179",
      rating: "4.8",
      enrolled: "420000",
      duration: "30",
      lastupdated: "Sept 2025",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    },
  ];
  return (
    <div className="w-screen h-screen bg-gradient-to-br from-[#0F2027] via-[#2C5364] to-[#2C5364] flex flex-col gap-5 items-center pt-20">
      <Navbar />
      <div className=" w-full h-[20%]  flex justify-center items-center flex-col gap-2">
        <div className="text-3xl sm:text-4xl text-white font-bold">
          Learning Hub
        </div>
        <div className="text-sm sm:text-lg text-slate-400 font-semibold">
          Every course and projects that CodeQuest offers
        </div>
      </div>
      <div className="w-[90%] border h-10 flex justify-start items-center rounded-2xl">
        <input
          type="text"
          placeholder="Search Courses..."
          className="outline-none pl-4 text-xl text-slate-200 w-full h-full"
        />
      </div>
      <div className="w-[90%] h-auto flex flex-wrap justify-around space-y-5">
        {coursedata.map((course, idx) => (
          <CourseCard key={idx} course={course} />
        ))}
      </div>
    </div>
  );
};

export default page;
