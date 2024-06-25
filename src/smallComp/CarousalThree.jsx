import { useState, useEffect } from "react";
import "./CarousalThree.css"
import { datathree } from "../components/Constants";

function CarousalThree() {
    const [slideThree, setSlideThree] = useState(0);
    let loop;

    useEffect(() =>{
        
        loop = setInterval(() =>{
            setSlideThree(s => (s+1)%2);
        },3000);
        return () => clearInterval(loop);
    },[])

    return(
        <div className="carousalThree">
            {
                datathree.map((item, idx)=> {
                    return(<img src={item.img} alt="image" key={idx} className={slideThree == idx ? "slideThree" : "slideThree slide-hiddenThree"} />)
                })
            }
            <div className="carousalinner">
                <span className="indicatorsThree">
                    {
                        datathree.map((_,idx) => {
                            return <button key={idx} onClick={()=> setSlideThree(idx)} className={slideThree == idx ? "indicatorThree indicator-activeThree" :  "indicatorThree indicator-inactiveThree"}></button>
                        })
                    }
                </span>
            </div>
        </div>
    )
}
export default CarousalThree;