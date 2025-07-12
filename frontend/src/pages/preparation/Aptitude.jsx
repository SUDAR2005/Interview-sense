import React, {useRef, useEffect, useState} from "react";
import AptitudePrepationDisplay from "../../components/AptitudePreparationDisplay"
import LoadingSpinner from "../../components/LoadingSpinner";
function Aptitude(){
    const [topic, setTopic] = useState("default");
    // const [display, setDisplay] = useState(false)
    let reference = useRef(null)
    function handleChange(){
        if(ref){
            setTopic(reference.current.value)
            console.log(reference.current.value)
        }
        
    }
    return(
        <>
            <div className="block align-middle text-center justify-center mt-8 mr-6">
                <select name="topic" id="topic" 
                className="items-center  border-3 border-gray-300 rounded-l-3xl rounded-b-3xl px-2 py-2 shadow-md mb-2"
                ref={reference}
                onChange={handleChange}>
                    <option value="default">Select a Topic</option>
                    <option value="Simplification ">Simplification </option>
                    <option value="Number Series">Number Series</option>
                    <option value="Algebra">Algebra</option>
                    <option value="Percentage">Percentage</option>
                    <option value="Ratio & Proportion">Ratio & Proportion</option>
                    <option value="Average">Average</option>
                    <option value="Interest">Interest</option>
                    <option value="Profit & Loss">Profit & Loss</option>
                    <option value="Speed, Time & Distance">Speed, Time & Distance</option>
                    <option value="Mixture & Allegation">Mixture & Allegation</option>
                    <option value="Time and Work ">Time and Work </option>
                    <option value="Permutation, Combination & Probability">Permutation, Combination & Probability</option>
                    <option value="Data Sufficiency">Data Sufficiency</option>
                    <option value="Comparison of Quantities">Comparison of Quantities</option>
                </select>
                <AptitudePrepationDisplay topic={topic}/>
            </div>
        </>
    )
}

export default Aptitude