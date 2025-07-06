import React from 'react';
import Typewriter from 'typewriter-effect';

function Hero() {
    return (
        <>
            <h1 className='text-4xl text-center py-4'>Welcome Enthusiast</h1>
            <div className='flex justify-center text-2xl font-semibold'>
                <p className='px-2'>We help you to </p>
                <div className='text-blue-500'>
                    <Typewriter
                        options={{
                            strings: ['Learn', 'Build', 'Grow', 'Get Hired'],
                            autoStart: true,
                            loop: true,
                            delay: 50,
                            deleteSpeed: 30,
                            pauseFor: 2000,
                        }}
                    />
                </div>
            </div>

            {/* Search Box */}
            <div className='flex justify-center mt-10'>
                <div className='search-company flex items-center w-full max-w-xl border-3 border-gray-300 rounded-l-3xl rounded-b-3xl px-4 py-2 shadow-md'>
                    <input
                        type="text"
                        className="flex-grow px-4 py-2 focus:outline-none text-lg"
                        placeholder="Search with us..."
                    />
                    <button className= "search  bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full font-semibold transition duration-300">
                        Search
                    </button>
                </div>
            </div>
        </>
    );
}

export default Hero;
