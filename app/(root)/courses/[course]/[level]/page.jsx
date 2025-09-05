'use client'
import React,{use} from 'react'


const page = ({params}) => {
    const {course,level} = use(params)
    return (
        <div className='w-screen h-screen bg-[#1a1a1a] flex justify-center items-center'>
            <div className='flex justify-around items-center w-[99%] h-full pt-20'>
                <div className='w-[49%] h-[96%] bg-[#2a2a2a] border border-white/20 rounded-2xl shadow-lg backdrop-blur-md flex flex-col items-center justify-around '>
                    <div className=' w-[95%] h-[15%]'>
                        <div className='w-full h-[70%] text-3xl capitalize text-white'>
                            {level}
                        </div>
                    </div>
                    <div className=' w-[95%] h-[60%] border'>

                    </div>
                    <div className='w-[95%] h-[10%] border'>

                    </div>
                </div>
                <div className='w-[49%] h-[96%] bg-[#2a2a2a] border border-white/20 rounded-2xl shadow-lg backdrop-blur-md'>

                </div>
            </div>
        </div>
    )
}

export default page