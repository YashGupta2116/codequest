import React from 'react'

const Levelcard = ({level,description,status}) => {
    return (
        <div className='w-[95%] h-24 bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] border border-white/20 rounded-2xl flex flex-col justify-around items-center shadow-lg backdrop-blur-md transition-transform duration-300 hover:scale-[1.02]'>
            
            {/* Header */}
            <div className='w-[95%] h-[50%] flex justify-between items-center'>
                <div className='text-white text-xl font-semibold'>Level-{level}</div>
                <div className='text-gray-300 text-sm'>{description}</div>
            </div>
            
            {/* Progress */}
            <div className='w-[95%] h-[30%] flex items-center gap-3'>
                <div className='w-full h-3 bg-white/20 rounded-full overflow-hidden'>
                    <div className='h-full bg-green-500 rounded-full transition-all duration-500 ease-out' style={{ width: `${status}%` }}></div>
                </div>
                <div className='text-white text-sm font-medium'>{status}%</div>
            </div>
        </div>
    )
}

export default Levelcard
