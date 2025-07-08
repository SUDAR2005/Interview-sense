import React from "react";
import { Link } from "react-router-dom";
import Aptitude from "./preparation/aptitude";
import Code from "./preparation/Code";
import Interview from "./preparation/Interview";
import { Routes, Route } from "react-router-dom";
function Placements(){
    return(
        <>
        <div className="pt-8">
            <ul className="flex align-middle justify-center">
                <li>
                    <Link to="/preparation/" className="transition-all py-2 px-4 hover:border-b-2 hover:cursor-pointer hover:text-b" >Aptitude</Link>
                </li>
                <li>
                    <Link to="/preparation/Coding" className="transition-all py-2 px-4 hover:border-b-2 hover:cursor-pointer hover:text-b">Coding</Link>
                </li>
                <li>
                    <Link to="/preparation/Interview" className="transition-all py-2 px-4 hover:border-b-2 hover:cursor-pointer hover:text-b">In-person Interview</Link>
                </li>    
            </ul>
        </div>
        <Routes>
          <Route path="/" element={<Aptitude />} />
          <Route path="Coding" element={<Code/>} />
          <Route path="Interview" element={<Interview/>} />
        </Routes>
        </>
    )
}

export default Placements