import { useState } from "react";
import "../smallComp/Carousal.css";


function HotelCardInfoCarousalFirst({data}){
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
        <div className="HotelCardInfoCarousalFirst">
            <div className="carousal">
                {
                    data.map((item,idx) => {
                        return <img src={item} alt="image" key={idx} className={slide == idx ? "slide" : "slide slide-hidden"}/>
                    })
                }
                <div className="flex">
                    <svg className="arrow leftarror" onClick={(e) => {e.stopPropagation();prevSlide();}} width='6' height='10' viewBox="0 0 6 10" xmlns="http://www.w3.org/2000/svg" ></svg>
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
        </div>
    )
}
export default HotelCardInfoCarousalFirst;