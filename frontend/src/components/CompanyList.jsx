import React, { useState, useEffect, useRef } from "react";
import companyData from "../../data/company.json";
import CompanyBox from "../components/ComapanyBox";

function CompanyList({ right }) {
  const [companies, setCompanies] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    setCompanies(companyData);
    const scrollContainer = scrollRef.current;

    const interval = setInterval(() => {
      if (!scrollContainer) return;
      scrollContainer.scrollBy({
        left: right ? 1 : 2,
        behavior: "smooth"
      });
    }, 20);

    return () => clearInterval(interval);
  }, [right]);

  return (
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
  );
}

export default CompanyList;
