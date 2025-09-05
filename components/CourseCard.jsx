'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

const CourseCard = ({ course }) => {
    const { title, lessons, rating, enrolled, duration, lastupdated ,src} = course || {}
    const router = useRouter();
    const handleClick = () =>{
        router.push(`/courses/${title.toLowerCase()}`)
    }
    return (
        <div onClick={handleClick} 
        className='w-[90%] sm:w-[48%] lg:w-[31%] xl:w-[22%] h-35 rounded-xl border border-slate-700 bg-[#13252d] p-4 text-slate-200 flex flex-col justify-around'>
            <div className='w-full h-[85%]  flex justify-around'>
                <div className='w-[80%] h-full'>
                    <div className='text-xl font-semibold'>Learn {title}</div>
                    <div className='flex h-5 w-40 text-xs text-[#9a9a9a]'>
                        {lessons} lessons
                    </div>
                    <div className='text-md text-[#9a9a9a]'>Rating: {rating}</div>
                </div>
                <div className=' w-[20%] h-full  flex justify-end'>
                    <img src={src} alt=""  className='w-12 h-12'/>
                </div>
            </div>
            <div className='h-[15%] w-full flex gap-2'>
                <div className=' flex text-xs text-[#9a9a9a] h-full w-[25%] items-center gap-3'>
                    <img src="/people.svg" alt=""  className='h-3 w-3'/>
                    {enrolled}
                </div>
                <div className=' flex text-xs text-[#9a9a9a] h-full w-[30%] items-center gap-1'>
                    <img src="/clock.svg" alt=""  className='h-3 w-3'/>
                    {duration} hours
                </div>
                <div className=' flex text-xs text-[#9a9a9a] h-full w-[40%] items-center justify-end'>
                    {lastupdated}
                </div>
            </div>
        </div>
    )
}

export default CourseCard