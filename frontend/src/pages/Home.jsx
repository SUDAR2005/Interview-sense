import React from "react"
import Hero from "../components/Hero"
import CompanyBox from "../components/ComapanyBox"
function Home(){
    return(
    <>
    <Hero/>
      <div className='company-list'>
        <CompanyBox name={'EmbedUR'} rating={4.8} description={'AI driven solution providers for Edge Devices'} link={'https://www.embedur.ai/'}/>
      </div>
    </>
    )
}

export default Home;
