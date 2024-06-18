import "./Navbar.css"
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
import { IoPersonOutline } from "react-icons/io5";
import { MdOutlineSwapHorizontalCircle } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { GoArrowSwitch } from "react-icons/go";

import React, { useState, useEffect } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { objDropDownCity } from "../Constants";
import { NavLink } from "react-router-dom";



export const Navbar = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [openDate, setOpenDate] = useState(false);
 
  const [adult, setAdult] = useState(1);
  const [children, setChildren] = useState(0);
  const [infant, setInfant] = useState(0);
  const [classFlight, setClassFlight] = useState("Economy");
  const [showPassengerDropDown, setShowPassengerDropDown] = useState(false);
  const [showDropDown, setShowDropDown] = useState(false);
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [infantCount, setInfantCount] = useState(0);
  const [tripType, setTripType] = useState('oneway');
  const [flightIn, setFlightIn] = useState("");
  const [flightInData, setFlightInData] = useState({});
  const [flightInOutPop, setFlightInOutPop] = useState({in: false, out: false});
  const [flightOut, setFlightOut] = useState("");
  const [flightOutData, setFlightOutData] = useState({});


  const modifyCount = (type, action) => {
    switch (action) {
      case 'increment':
        if (type === 'adult') setAdultCount(adultCount + 1);
        else if (type === 'child') setChildCount(childCount + 1);
        else if (type === 'infant') setInfantCount(infantCount + 1);
        break;
      case 'decrement':
        if (type === 'adult' && adultCount > 1) setAdultCount(adultCount - 1);
        else if (type === 'child' && childCount > 0) setChildCount(childCount - 1);
        else if (type === 'infant' && infantCount > 0) setInfantCount(infantCount - 1);
        break;
      default:
        break;
    }
  };
  //swap flightIn and flightOut
  function reverseInput(){
    const fi = flightIn;
    const fo = flightOut;
    setFlightIn(fo);
    setFlightOut(fi);
  }
   //Push to next page
   function getFlights(){
    if(flightIn && flightOut){
        navigate(`/flights/results?flightfrom=${flightInData.name}&flightto=${flightOutData.name}&dayofweek=${dateGo}`);
    }
  }

 
  const togglePassengerDropDown = () => {
    setShowPassengerDropDown(!showPassengerDropDown);
    setShowDropDown(false);
  };
  const toggleDropdown = () => {
    setShowDropDown(!showDropDown);
    setShowPassengerDropDown(false);
  };
  const changeTripType = (type) => {
    setTripType(type);
    setShowDropDown(false);
  };
  return (
    <div className="navbar">
      <div className="navContainer">
        <div className="navList">

          <NavLink to='/' style={{textDecoration: 'none'}}>
            <NavLink to='/flights' style={{textDecoration: 'none'}}>
          <div id="navId" className="navListItem">
          
            <PiAirplaneTiltFill />
            <span>Flights</span>
          </div>
          </NavLink>
          <NavLink to='/hotels' style={{textDecoration: 'none'}}>
          <div className="navListItem">
            <BiBuildings />
            <span>Hotels</span>
          </div>
          </NavLink>
          <div className="navListItem">
            <IoMdBus />
            <span>Bus</span>
          </div>
          <div className="navListItem">
            <BiSolidOffer />
            <span>Offers</span>
          </div>
          <div className="navListItem">
            <IoBagHandleOutline />
            <span>My trips</span>
          </div>
          <div className="navListItem">
            <GiAlliedStar />
            <span>Cleartrip for Buisness</span>
          </div>
          <div className="navListItem">
            <BiSupport />
            <span>Support</span>
          </div>
          </NavLink>
        </div>
        <div className="desc">
          <h1 className="heading">Search flights</h1>
          <p>Enjoy hassle free bookings with Cleartrip</p>
        </div>
        <div className="middleBox">
          <div className="dropdownItem"> <button className="dropdown-button" onClick={toggleDropdown}>
            {tripType === 'oneway' ? <GoArrowRight /> : <GoArrowSwitch />}
            {tripType === 'oneway' ? 'One Way' : 'Round trip'} <RiArrowDropDownLine /></button>
            {showDropDown && (
              <div className="dropdown-content">
                <button onClick={() => changeTripType('oneway')}>One Way</button>
                <button onClick={() => changeTripType('roundtrip')}>Round trip</button>
              </div>
            )}
          </div>
          <div className="dropdownItem">
            <IoPersonOutline />{`${adult}Adult, `}{children>0 ? `${children}Child, `: ""}{infant>0 ? `${infant}Infant, `: ""}{(classFlight == "First" || classFlight == "Buisness") ? `${classFlight} className` : classFlight == "Premium" ? `${classFlight}economy`: classFlight} <button className="dropdown-button" onClick={togglePassengerDropDown}><RiArrowDropDownLine /></button>
            {showPassengerDropDown && (
              <div className="dropdown-counter">
                <div className="counter">
                  <span id="options">Adult<span id="options" className="bottomlight">(12+ Years)</span></span>
                  <button className="plusminus" onClick={() => setAdult(adult+1)}>+</button>
                  <span>{adult}</span>
                  <button className="plusminus" onClick={() => setAdult(adult-1)} disabled={adult == 1}>-</button>
                </div>
                <div className="counter">
                  <span id="options">Children<span id="options" className="bottomlight">(2 - 12 yrs)</span></span>
                  <button className="plusminus" onClick={() => setChildren(children+1)}>+</button>
                  <span>{children}</span>
                  <button className="plusminus" onClick={() => setChildren(children-1)} disabled={children ==0} >-</button>
                </div>
                <div className="counter">
                  <span id="options">Infant<span id="options" className="bottomlight">(Below 2 yrs)</span></span>
                  <button className="plusminus" onClick={() => setInfant(infant+1)}>+</button>
                  <span>{infant}</span>
                  <button className="plusminus" onClick={() => setInfant(infant-1)} disabled={infant == 0}>-</button>
                </div>
                <div>
                  <button className="navBtnNormal" id="navibtn" onClick={() => setClassFlight("Economy")}>Economy</button>
                  <button className="navBtnNormal" onClick={() => setClassFlight("Buisness")}>Buisness class</button>
                  <button className="navBtnNormal" onClick={() => setClassFlight("First")}>First class</button>
                  <button className="navBtnNormal" onClick={() => setClassFlight("Premium")}>Premium economy</button>
                </div>
              </div>
            )}
          </div>
          <div className="navBtn">
            <button className="navBtnNormal" id="navibtn">Regular fare</button>
            <button className="navBtnNormal">Senoir citizen fare</button>
            <button className="navBtnNormal">Student fare</button>
            <button className="navBtnNormal">Armed forces fare</button>
          </div>
          <div className="navBtn">
            <div className="navSearchItem">
              <button className="holding1">
                <div className="icon"><MdFlightTakeoff size={25} color="gray" /> </div>
                <input type="text" placeholder="Where from?" className="navIcon" value={flightIn} onClick={() => {setFlightInOutPop({}); setFlightInOutPop({["in"] : !flightInOutPop["in"]}) }} onChange={(e) => {setFlightIn(e.target.value)}} />
                {flightInOutPop["in"] == true && <div className="flightInData">
                  {objDropDownCity.map((item) =>(
                    <div className="flex-a" onClick={() => {setFlightIn(`${item.name} - ${item.fname}`); setFlightInData(item); setFlightInOutPop({})}}>
                      <p>{item.name}</p>
                      <h4>{item.fname}{item.lname}</h4>
                    </div>
                  ))}
                  </div>}
                </button>
              <MdOutlineSwapHorizontalCircle size={40} color="blue" className="middleIcon"  onClick={() => {reverseInput()}}/>
              <button className="holding2">
                <div className="icon"><MdFlightLand size={25} color="gray" /> </div>
                <input type="text" placeholder="Where to?" className="navIcon" value={flightOut} onClick={() => {setFlightInOutPop({}); setFlightInOutPop({["out"] : !flightInOutPop["out"]}) }} onChange={(e) => {setFlightOut(e.target.value)}} />
                {flightInOutPop["out"] == true && <div className="flightInData">
                  {objDropDownCity.map((item) =>(
                    <div className="flex-a" onClick={() => {setFlightOut(`${item.name} - ${item.fname}`); setFlightInData(item); setFlightInOutPop({})}}>
                      <p>{item.name}</p>
                      <h4>{item.fname}{item.lname}</h4>
                    </div>
                  ))}
                  </div>}
              </button>
            </div>
            <div className="navSearchDateTime">
  
              <button className="navSearchDate"><SlCalender /><DatePicker selected={startDate} onChange={(date) => setStartDate(date)}
                dateFormat="dd, MMMM yyyy" minDate={new Date()} className="dateButton" /></button>
              <button className="navSearchDate" id="" onClick={()=>setOpenDate(!openDate)}>Return{openDate && <DatePicker selected={startDate} onChange={(date) => setStartDate(date)}
                dateFormat="dd, MMMM yyyy" minDate={new Date()} className="dateButton" />}</button>
              <button /*className="searchBtn"*/ className={`${(!flightIn || !flightOut)||samefield ? "buttondisabled": ""}`} onClick={() => getFlights()} disabled={(!flightIn || !flightOut || samefield)}>Search flights</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Navbar
