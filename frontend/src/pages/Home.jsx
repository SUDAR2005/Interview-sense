import React, { useEffect, useState, useRef } from "react";
import Hero from "../components/Hero";
import CompanyBox from "../components/ComapanyBox";
import companyData from "../../data/company.json"; // Adjust path as needed

function Home() {
  const [companies, setCompanies] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    setCompanies(companyData);
    const interval = setInterval(() => {
      if (scrollContainer) {
        scrollContainer.scrollBy({ left: 1, behavior: "smooth" });
      }
    }, 20);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Hero />
      <div
        ref={scrollRef}
        className="overflow-hidden whitespace-nowrap px-4 py-6 scroll-smooth"
        style={{ maxWidth: "100%", whiteSpace: "nowrap" }}
      >
        <div className="flex gap-6 w-max">
          {companies.map((company, index) => (
            <CompanyBox
              key={index}
              name={company.name}
              rating={company.rating}
              description={company.description}
              link={company.link}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;
