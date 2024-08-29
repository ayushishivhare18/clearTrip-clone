import { useState, useEffect} from "react";
//import "../smallComp/Carousal.css";
import "./HotelResultCardCarousal.css"

function HotelResultCardCarousal({data}){
    const [slide, setSlide] = useState(0);

    function nextSlide(){
        setSlide((slide+1)%data.length);
    }
    function prevSlide() {
        if(slide == 0){
            setSlide(data.length-1);
        }
        else{
            setSlide((slide-1)%data.length);
        }
    }

    return(
        
            <div className="carousal HotelResultCardCarousal">
                {
                    data.map((item, idx) => {
                        return <img loading="lazy" src={item} alt="image" key={idx} className={slide == idx ? "slide" : "slide slide-hidden"}/>
                    })
                }
                <div className="flex">
                    <svg className="arrow leftarrow" onClick={(e) => {e.stopPropagation();prevSlide();}} width='6' height='10' viewBox="0 0 6 10" xmlns="http://www.w3.org/2000/svg" ></svg>
                    <span className="indicators">
                        {
                            data.map((_, idx) =>{
                                return <button key={idx} onClick={() => setSlide(idx)} className={slide == idx ? "indicator indicator-active" : "indicator indicator-inactive"}></button>
                            })
                        }
                    </span>
                    <svg className="arrow rightarrow" onClick={(e) => {e.stopPropagation();nextSlide();}} width='6' height='10' viewBox="0 0 6 10" xmlns="http://www.w3.org/2000/svg"></svg>
                </div>
            </div>
        
    )
}
export default HotelResultCardCarousal;