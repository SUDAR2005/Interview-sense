import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

function CompanyBox({ name, rating, description, link}) {
    // const getStars = () => {
    //     const stars = [];
    //     let tempRating = rating;
    //     for (let i = 0; i < 5; i++) {
    //         if (tempRating >= 1) {
    //             stars.push(<FaStar key={i} className="text-yellow-500" />);
    //             tempRating -= 1;
    //         } else if (tempRating >= 0.5) {
    //             stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
    //             tempRating -= 0.5;
    //         } else {
    //             stars.push(<FaRegStar key={i} className="text-yellow-500" />);
    //         }
    //     }
    //     return stars;
    // };

    return (
        <div
            className="block mt-6 mx-auto max-w-xl border border-gray-300 rounded-lg p-4 shadow-md bg-white hover:shadow-lg transition hover:cursor-pointer"
        >
            <h2 className="text-xl font-bold text-gray-800">{name}</h2>
            <p className="text-gray-600 mt-2">{description}</p>
            <a className='flex justify-end'
                href={link}
                target="_blank"
                rel="noopener noreferrer">
                <button className= " bg-blue-500 hover:bg-blue-600 text-white mt-3 px-5 py-2 rounded-2xl font-semibold transition duration-300">Visit</button>
            </a>
        </div>
    );
}

export default CompanyBox;
