import React, { useEffect, useState, useRef } from "react";
import Hero from "../components/Hero";
import CompanyList from "../components/CompanyList";
function Home() {

  return (
    <>
      <Hero />
      
      <CompanyList className="mt-18"/>
      {/* <CompanyList right={true}/> */}
    </>
  );
}

export default Home;
