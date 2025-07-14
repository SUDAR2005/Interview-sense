import React, { useState } from "react";
import companyData from "../../data/company.json";

function SearchBox() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  const handleSubmit = () => {
    setSearchTerm("");
    setResults([]);
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value.trim().toLowerCase();
    setSearchTerm(inputValue);

    if (inputValue) {
      const filteredCompanies = companyData.filter((company) =>
        company.name.toLowerCase().includes(inputValue)
      );
      setResults(filteredCompanies);
    } else {
      setResults([]);
    }
  };

  return (
    <>
      <div className="flex justify-center mt-16">
        <div className="flex items-center w-full max-w-xl bg-white border border-gray-300 rounded-full px-4 py-2 shadow-md">
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            className="flex-grow px-4 py-2 rounded-full focus:outline-none text-lg"
            placeholder="Search companies..."
          />
          <button
            onClick={handleSubmit}
            className="ml-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-2 rounded-full font-semibold shadow transition duration-300"
          >
            Submit
          </button>
        </div>
      </div>

      {results.length > 0 && (
        <div className="mt-4 max-w-xl mx-auto overflow-y-auto max-h-40">
          <ul className="bg-white border border-gray-200 rounded-xl shadow-lg">
            {results.map((company, index) => (
              <a href={company.link} target="_blank"
              >
                <li key={index}
                className="px-4 py-3 border-[gray] border-b last:border-b-0 hover:bg-gray-100 transition-colors duration-200">
                    {company.name}
                </li>
              </a>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default SearchBox;
