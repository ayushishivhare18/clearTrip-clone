import React, { useState, useEffect } from "react";
import './CarousalBottom.css'
import { datatwo } from "../components/Constants";
import { Link } from "react-router-dom";

function CarousalHotelBottom(){
    const [slidetwo, setSlidetwo] = useState(0);

    function nextSlidetwo(){
        setSlide((slide + 1) % 7);
    }
    function prevSlidetwo(){
        if(slide == 0){
            setSlide(6);
        }else{
            setSlide((slide - 1) % 7);
        }
    }
    useEffect(() => {
        const loop = setInterval(() =>{
            setSlidetwo((s) => (s+1) % 7);
        }, 8000);
        return () => clearInterval(loop);
    },[]);
    return(
        <div className="carousaltwo flex">
            {datatwo.map((item, idx) => (
                <div key={idx} className={slidetwo === idx ? "slidetwo" : "slidetwo slide-hiddentwo"}>
                <h4>{item.h4}</h4>
                <h5>{item.h5}</h5>
                <p className="secondd">{item.p}</p>
                <Link to={`/`}>
                    <span> Know more</span>
                </Link>
            </div>
            ))}
            <div className="flex">
                <svg className="arrowtwo arrowtwo-left"
                onClick={prevSlidetwo}
                width="5" height="10"
                viewBox="0 0 6 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                >
                    <path 
                    stroke="gray"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    ></path>
                    </svg>
                    <span className="indicatorstwo">
                        {datatwo.map((_, idx) => (
                            <button key={idx} onClick={() =>setSlidetwo(idx)}
                            className={slidetwo === idx ? "indicatortwo indicator-activetwo" : "indicatortwo indicator-inactivetwo"}></button>
                        ))}
                    </span>
                    <svg className="arrowtwo arrowtwo-right" onClick={nextSlidetwo} width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg"> 
                        <path 
                         stroke="gray"
                         strokeWidth="2"
                         strokeLinecap="round"
                         strokeLinejoin="round"></path>
                    </svg>
            </div>

        </div>
    );
}
export default CarousalHotelBottom;
