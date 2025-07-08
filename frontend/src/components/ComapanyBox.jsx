import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

function CompanyBox({ name, rating, description, link, className = '' }) {
  return (
    <div className={`hover:bg-blue-100 hover:cursor-pointer flex-shrink-0 w-80 h-48 p-6 bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col justify-between ${className}`}>
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{name}</h3>
        {/* <div className="flex items-center mb-3">
          <span className="text-yellow-500 text-lg">★</span>
          <span className="ml-1 text-gray-600 font-medium">{rating}</span>
        </div> */}
        <p className="text-gray-600 text-sm line-clamp-3">{description}</p>
      </div>
      <a 
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-black text-sm font-medium mt-auto"
      >
        Visit Company
      </a>
    </div>
    );
}

export default CompanyBox;
