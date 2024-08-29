import React, { useState, useEffect, useRef }from 'react';
import { useNavigate, Link } from "react-router-dom";
import "./Navbar.css"
import { CalendarMonth } from "../../smallComp/icons";
import Calendar from 'react-calendar';
import { objDropDownCity, objColor, objFares, months, daysOfWeek } from "../Constants";
import CarousalHotelUp from '../../smallComp/CarousalHotelUp';
import CarousalHotelBottom from '../../smallComp/CarousalHotelBottom';
import { FaArrowRight } from "react-icons/fa6";
import { MdArrowDropDown } from "react-icons/md";
import { IoPersonOutline } from "react-icons/io5";


import { PiAirplaneTiltFill } from "react-icons/pi";
import { BiBuildings } from "react-icons/bi";
import { IoMdBus } from "react-icons/io";
import { BiSolidOffer } from "react-icons/bi";
import { IoBagHandleOutline } from "react-icons/io5";
import { GiAlliedStar } from "react-icons/gi";
import { BiSupport } from "react-icons/bi";
import { MdFlightTakeoff } from "react-icons/md";
import { MdFlightLand } from "react-icons/md";
import { GoArrowRight } from "react-icons/go";
import { RiArrowDropDownLine } from "react-icons/ri";
import { MdOutlineSwapHorizontalCircle } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { GoArrowSwitch } from "react-icons/go";


export const Navbar = () => {
  const navigate = useNavigate();
  const [ways, setWays] = useState("one");
  const [adult, setAdult] = useState(1);
  const [children, setChildren] = useState(0);
  const [infant, setInfant] = useState(0);
  const [classFlight, setClassFlight] = useState("Economy");
  const [rotateButtonOneWay, setRotateButtonOneWay] = useState(false);
  const [rotateButtonPeople, setRotateButtonPeople] = useState(false);
  const [fare, setFare] = useState("Regular_fare");
  const [showPassengerDropDown, setShowPassengerDropDown] = useState(false);
  const [showDropDown, setShowDropDown] = useState(false);
  const [datego, setdatego] = useState(new Date());
  const [daygo, setdaygo] = useState(daysOfWeek[datego.getDay()]);
  const [monthgo, setmonthgo] = useState(months[datego.getMonth()]);
  const [activeReDate, setactiveReDate] = useState(false);
  const [datere, setdatere] = useState(activeReDate ? new Date() : "");
  const [dayre, setdayre] = useState(activeReDate ? daysOfWeek[datere.getDay()] : "");
  const [monthre, setmonthre] = useState(activeReDate ? months[datere.getMonth()] : "")  
  const [datePop, setdatePop] = useState({ go: false, re: false })
  const [tripType, setTripType] = useState('oneway');
  const [flightIn, setFlightIn] = useState("");
  const [flightInData, setFlightInData] = useState({});
  const [flightInOutPop, setFlightInOutPop] = useState({in: false, out: false});
  const [flightOut, setFlightOut] = useState("");
  const [flightOutData, setFlightOutData] = useState({});
  const [samefield, setSamefield] = useState(false);

  //going date manager
  function datePrintGo(){
    setdaygo(daysOfWeek[datego.getDay()]);
    setmonthgo(months[datego.getMonth()]);
    if (activeReDate) {
      if ((datere.getMonth() + 1) < (datego.getMonth() + 1) || ((datere.getMonth() + 1) === (datego.getMonth() + 1) && datere.getDate() < datego.getDate())) {
        setdatere(datego);
        datePrintGo();
      }
    }
  }

  //return date
  function datePrintRe(){
    if (activeReDate) {
      setdayre(daysOfWeek[datere.getDay()])
      setmonthre(months[datere.getMonth()]);
    }
  }

  //push to next page
  function getFlights(){
    if(flightIn && flightOut){
      navigate(`/flights/flightfrom=${flightInData.name}&flightto=${flightOutData.name}&dayofweek=${datego}`);
    }
  }
  //swap flightIn and flightOut
  function reverseInput(){
    const fi = flightIn;
    const fo = flightOut;
    setFlightIn(fo);
    setFlightOut(fi);
  }
   function forButtonDisable(){
    {
      Object.keys(objFares).forEach((item) => {
        const element = document.getElementsByClassName(objFares[item]);
        if(element.length > 0){
          element[0].style.color = "black";
          element[0].style.border = "0.5px solid lightgray";
          element[0].style.backgroundColor = "white";
        }
      });
      const fareElement = document.getElementsByClassName(`${fare}`);
      if(fareElement.length > 0){
        fareElement[0].style.color = "#3366CC";
        fareElement[0].style.border = "0.5px solid #3366CC";
        fareElement[0].style.backgroundColor = "#3366cc19";
      }
      
    }
    {
      if(flightIn == flightOut && flightIn != "" && flightOut!=""){
        setSamefield(true);
      }else{
        setSamefield(false);
      }
    }
    if(rotateButtonPeople){
      {
        const minbuttons = document.getElementsByClassName("min");
        if(minbuttons.length > 0){
          minbuttons[0].style.color = adult ==1 ? "gray": "#3366CC";
          minbuttons[0].style.border = adult ==1 ? "1px solid gray": "1px solid #3366CC";
          minbuttons[1].style.color = children ==0 ? "gray": "#3366CC";
          minbuttons[1].style.border = children ==0 ? "1px solid gray": "1px solid #3366CC";
          minbuttons[2].style.color = infant ==0 ? "gray": "#3366CC";
          minbuttons[2].style.border = infant ==0 ? "1px solid gray": "1px solid #3366CC";
          
        }
      }
      {
        Object.keys(objColor).forEach((item) => {
          const colorElements = document.getElementsByClassName(objColor[item]);
          if(colorElements.length > 0){
            colorElements[0].style.color = "black";
            colorElements[0].style.border = "0.5px solid lightgray";
          }
        });
        const classFlightElement =  document.getElementsByClassName(`${classFlight}`);
        if(classFlightElement.length > 0){
          classFlightElement[0].style.color = "#3366CC";
          classFlightElement[0].style.border = "1px solid #3366CC";
        }
      }
    }
   }

  useEffect(() => {
    forButtonDisable();
    datePrintGo();
    datePrintRe();
    setdatePop({ go: false, re: false });
    setFlightInOutPop({ in: false, out: false })
  },[adult, children, infant, rotateButtonPeople, rotateButtonOneWay, classFlight, fare, datego, datere, flightIn, flightOut]);

  return (
    <div className="navbar flex">
      <div className="navContainer">
        <div className="desc">
          <h1 className="heading">Search flights</h1>
          <p className='nextLine'>Enjoy hassle free bookings with Cleartrip</p>
        </div>
        <div className="middleBox flex flex-c">
          <div className="dropdownItem flex-a"> 
          <div className="wayDefine flex-1a" onClick={() => {setRotateButtonOneWay(!rotateButtonOneWay); setRotateButtonPeople(false)}}>
            {ways == "one" ?
            (<p className='flex-1a'><FaArrowRight />&nbsp;One way&nbsp;&nbsp;<MdArrowDropDown /></p>):  
            (<p className='flex-1a'>&nbsp;Round trip&nbsp;&nbsp;<MdArrowDropDown /></p>)
          }
          <svg width='14' height='9' fill="currentColor" className={`t-all ml-3 ${rotateButtonOneWay ? "rotateButtonzero" : "rotateButtonOneNinty"}`} style={{ color: "rgb(153, 153, 153)", transform: "rotate(-180deg)" }}></svg>
          {rotateButtonOneWay && 
          <div className="wayChooser flex-a">
            <p onClick={() => {setWays("one"); setactiveReDate(false)}} className="flex-1a hov">
              {ways==="one" && <svg width='24' height='24' viewBox="0 0 24 24" fill="none"></svg>}
              <p className='wayChooserPtext'>&nbsp;&nbsp; One Way</p>
            </p>
            <p onClick={() => {setWays("two"); setdatere(datego); setactiveReDate(true)}} className="flex-1a hov">
              {ways==="two" && <svg width='24' height='24' viewBox="0 0 24 24" fill="none"></svg>}
              <p className='wayChooserPtext'>&nbsp;&nbsp; Round trip</p>
            </p>
          </div>
          }
          </div>
          <div className="peoplePop">
            <div className="peopleForTrip flex-1a" onClick={() => {setRotateButtonPeople(!rotateButtonPeople); setRotateButtonOneWay(false)}}>
            <p><IoPersonOutline />{`${adult} Adult, `}{children > 0 ? `${children} Child, ` : ""}{infant > 0 ? `${infant} Infant, ` : ""}{(classFlight == "First" || classFlight == "Bussiness") ? `${classFlight} className` : classFlight == "Premium" ? `${classFlight} economy` : classFlight}</p>
            &nbsp;&nbsp;<svg width="14" height="9" fill="currentColor" className={`t-all ml-3 ${rotateButtonPeople ? "rotateButtonzero" : "rotateButtonOneNinty"}`} style={{ color: "rgb(153, 153, 153)", transform: "rotate(-180deg)" }}><g fill="none" fillRule="evenodd"></g></svg>
            </div>
            {rotateButtonPeople && 
            <div className="peopleChooser flex-a">
              <div className='Adults flex'>
                      <div>
                        <h3>Adults</h3>
                        <h5>(12+ years)</h5>
                      </div>
                      <div className='peopleCounters flex-1a'>
                        <button className='flex-1a min' onClick={() => setAdult(adult - 1)} disabled={adult == 1} >-</button>
                        <h4 className='flex-1a'>{adult}</h4>
                        <button className='flex-1a' onClick={() => setAdult(adult + 1)}>+</button>
                      </div>
                      </div>
                      <div className='Children flex'>
                      <div>
                        <h3>Children</h3>
                        <h5>(2 - 12 yrs)</h5>
                      </div>
                      <div className='peopleCounters flex-1a'>
                        <button className='flex-1a min' onClick={() => setChildren(children - 1)} disabled={children == 0} >-</button>
                        <h4 className='flex-1a'>{children}</h4>
                        <button className='flex-1a' onClick={() => setChildren(children + 1)}>+</button>
                      </div>
                    </div>
                    <div className='Infants flex'>
                      <div>
                        <h3>Infants</h3>
                        <h5>(Below 2 yrs)</h5>
                      </div>
                      <div className='peopleCounters flex-1a'>
                        <button className='flex-1a min' onClick={() => setInfant(infant - 1)} disabled={infant == 0} >-</button>
                        <h4 className='flex-1a'>{infant}</h4>
                        <button className='flex-1a' onClick={() => setInfant(infant + 1)}>+</button>
                      </div>
                    </div>
                    <div className='peopleClasses'>
                      <div className='upperClassesdiv flex-a'>
                        <p className='flex-1a Economy' onClick={() => setClassFlight("Economy")}>Economy</p>
                        <p className='flex-1a Bussiness' onClick={() => setClassFlight("Bussiness")}>Bussiness class</p>
                        <p className='flex-1a First' onClick={() => setClassFlight("First")}>First class</p>
                      </div>
                      <div className='downClassesdiv'><p className='Premium' onClick={() => setClassFlight("Premium")}>Premium economy</p></div>
                    </div>
            </div>
            }
          </div>
          </div>
          
          <div className="navBtn">
            <div className="faresl flex-1a">
            <p className="Regular-fare" onClick={() => setFare("Regular-fare")} >Regular fare</p>
            <p className="Student-fare" onClick={() => setFare("Student-fare")} >Student fare</p>
            </div>
            <div className="faresr flex-1a">
            <p className="Senior-citizen-fare" onClick={() => setFare("Senior-citizen-fare")}>Senior citizen fare</p>
            <p className="Armed-forces-fare" onClick={() => setFare("Armed-forces-fare")}>Armed forces fare</p>
            </div>
            
          </div>
            <div className="inOutBtn flex">
              <div className="flex flex-c g5">
            <div className="navSearchItem b1 flex-a">
              <div className="flex-a">
                <div className="ii1 flex-a">
             
                <div className="icon"><MdFlightTakeoff size={25} color="gray" /> </div>
                <input type="text" placeholder="Where from?"  value={flightIn} onClick={(e) => {e.preventDefault();
                  setFlightInOutPop({}); setFlightInOutPop({["in"] : !flightInOutPop["in"]}) }} onChange={(e) => {setFlightIn(e.target.value)}} />
                {flightInOutPop["in"] == true && <div className="flightInData flex-a flex-c">
                  {objDropDownCity.map((item, index) =>(
                    <div key={index} className="slider flex-1a" onClick={() => {setFlightIn(`${item.name} - ${item.fname}`); setFlightInData(item); setFlightInOutPop({})}}>
                      <p>{item.name}</p>
                      <h4>{item.fname}{item.lname}</h4>
                    </div>
                  ))}
                  </div>}
                
                </div>
              </div>
              <MdOutlineSwapHorizontalCircle size={40} color="blue" className="middleIcon"  onClick={() => {reverseInput()}}/>
            <div className="i2 flex-a">
              <div className="ii2 flex-a">
                <div className="icon"><MdFlightLand size={25} color="gray" /> </div>
                <input type="text" placeholder="Where to?"  value={flightOut} onClick={(e) => {setFlightInOutPop({}); setFlightInOutPop({["out"] : !flightInOutPop["out"]}) }} onChange={(e) => {setFlightOut(e.target.value)}} />
                {flightInOutPop["out"] == true && <div className="flightInData flex-a flex-c">
                  {objDropDownCity.map((item) =>(
                    <div key={item.name} className="slider flex-1a" onClick={() => {setFlightOut(`${item.name} - ${item.fname}`); setFlightOutData(item); setFlightInOutPop({})}}>
                      <p>{item.name}</p>
                      <h4>{item.fname}{item.lname}</h4>
                    </div>
                  ))}
                  </div>}
                  </div>
                  </div>
            </div>
            {samefield && <span className="error">Departure and arrival airports / cities cannot be same.</span>}
            </div>
            </div>
            <div className='DateandButtonOuter flex-a'>
              <div className='DateandButtonInner flex-a'>
                <div className='datePicker flex-a'>
                  <div className='leftDatePicker flex-a' onClick={() => { setdatePop({ go: true, re: false }) }}>
                    <CalendarMonth className='calendarIcon' />
                    <div className='datesGoing'>{`${daygo}, ${monthgo} ${datego.getDate()}`}</div>
                    {datePop.go && <Calendar minDate={new Date()} onChange={(date) => { setdatego(date) }} value={datego} className="calendarForGoing" />}
                  </div>
                  <div className='rightDatePicker flex-1a' onClick={() => { setdatePop({ go: false, re: true }) }}>
                    <div className={`datesReturn ${!activeReDate && "blur"}`}>{activeReDate ? `${dayre}, ${monthre} ${datere.getDate()}` : "Return"} </div>
                    {datePop.re && <Calendar minDate={datego} onChange={(date) => { setdatere(date); setactiveReDate(true); setWays("two") }} value={datere} className="calendarForGoing" />}
                  </div>
                </div>
  
             
              <button className={`${(!flightIn || !flightOut||samefield) ? "buttondisabled": ""}`} onClick={() => getFlights()} disabled={(!flightIn || !flightOut || samefield)}>Search flights</button>
            </div>
          </div>
        </div>
      </div>
      <div className="asideBarFlightPage">
        <CarousalHotelUp className="flightPageRightTop"/>
        <div className="more-offers">
          <p>More offers</p>
          <Link to="/under-maintainance"><div>View all</div></Link>
        </div>
        <CarousalHotelBottom/>
      </div>
     
    </div>
  );
};
export default Navbar;
///*className={`${(!flightIn || !flightOut||samefield) ? "buttondisabled": ""}`} */
