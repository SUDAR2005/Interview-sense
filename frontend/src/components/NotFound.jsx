import React from "react";

export default function NotFound(){
    return(
        <>
            <div class="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div class="text-center">
                <h1 class="font-semibold text-indigo-600 text-6xl">404</h1>
                <h1 class="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">Page not found</h1>
                <p class="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">Sorry, we couldn’t find the page you’re looking for.</p>
                <div class="mt-10 flex items-center justify-center gap-x-6">
                <a href="/home" class="ml-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-2 rounded-full font-semibold shadow transition duration-300">Go back home</a>
                </div>
            </div>
            </div>
        </>
    )
}