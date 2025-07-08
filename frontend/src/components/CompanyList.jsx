import react, {useState, useEffect} from 'react'
import companyData from '../../data/company.json'
import CompanyBox from './ComapanyBox'
function CompanyList() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    setCompanies(companyData);
  }, []);

  return (
    <div className="bg-gray-50 py-8 mt-8">
      <div className="container mx-auto px-4">        
        <div className="relative overflow-hidden">
          <div 
            className="flex gap-4"
            style={{
              animation: 'infinite-scroll 25s linear infinite'
            }}
          >
            {/* First set of companies */}
            {companies.map((company, index) => (
              <CompanyBox
                key={`first-${index}`}
                name={company.name}
                rating={company.rating}
                description={company.description}
                link={company.link}
              />
            ))}

            {companies.map((company, index) => (
              <CompanyBox
                key={`second-${index}`}
                name={company.name}
                rating={company.rating}
                description={company.description}
                link={company.link}
              />
            ))}
            
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes infinite-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default CompanyList;
