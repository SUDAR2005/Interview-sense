import React from 'react';
import Typewriter from 'typewriter-effect';
import SearchBox from './SearchBox';
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
            <SearchBox/>
        </>
    );
}

export default Hero;
