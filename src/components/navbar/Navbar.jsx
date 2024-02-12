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
import React, { useState } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';



export const Navbar = () => {
  const [startDate, setStartDate] = useState(new Date());

  const [showPassengerDropDown, setShowPassengerDropDown] = useState(false);
  const [showDropDown, setShowDropDown] = useState(false);
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [infantCount, setInfantCount] = useState(0);
  const [tripType, setTripType] = useState('oneway')

  const modifyCount = (type, action)=>{
    switch(action){
      case 'increment':
        if(type === 'adult') setAdultCount(adultCount+1);
        else if(type === 'child') setChildCount(childCount+1);
        else if(type === 'infant') setInfantCount(infantCount+1);
        break;
        case 'decrement':
          if (type === 'adult' && adultCount>1) setAdultCount(adultCount-1);
          else if(type === 'child' && childCount>0) setChildCount(childCount-1);
          else if(type === 'infant' && infantCount>0) setInfantCount(infantCount-1);
          break;
          default:
            break;
    }
  };
  const togglePassengerDropDown = ()=>{
    setShowPassengerDropDown(!showPassengerDropDown);
    setShowDropDown(false);
  };
  const toggleDropdown = ()=>{
    setShowDropDown(!showDropDown);
    setShowPassengerDropDown(false);
  };
  const changeTripType = (type)=>{
    setTripType(type);
    setShowDropDown(false);
  };
  return (
    <div className="navbar">
      <div className="navContainer">
      <div className="navList">

        <div id="navId" className="navListItem">
        <PiAirplaneTiltFill />
        <span>Flights</span> 
        </div>
        <div className="navListItem">
        <BiBuildings />
        <span>Hotels</span> 
        </div>
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
        </div>
        <div className="desc">
        <h1 className="heading">Search flights</h1>
        <p>Enjoy hassle free bookings with Cleartrip</p>
        </div>
        <div className="middleBox">
        <div className="dropdownItem"> <button className="dropdown-button" onClick={toggleDropdown}>
          {tripType === 'oneway' ? <GoArrowRight /> : <GoArrowSwitch /> }
        {tripType ==='oneway' ? 'One Way': 'Round trip'} <RiArrowDropDownLine /></button>
        {showDropDown && (
          <div className="dropdown-content">
            <button onClick={()=>changeTripType('oneway')}>One Way</button>
            <button onClick={()=>changeTripType('roundtrip')}>Round trip</button>
             </div>
        )}
        </div>
        <div className="dropdownItem">
        <IoPersonOutline />1Adult, Economy <button className="dropdown-button" onClick={togglePassengerDropDown}><RiArrowDropDownLine /></button>
         {showPassengerDropDown && ( 
         <div className="dropdown-counter">
         <div className="counter">
            <span id="options">Adults<span id="options" className="bottomlight">(12+ Years)</span></span>
            <button className="plusminus" onClick={() => modifyCount('adult','increment')}>+</button>
            <span>{adultCount}</span>
            <button className="plusminus" onClick={() => modifyCount('adult', 'decrement')}>-</button>
          </div>
          <div className="counter">
            <span id="options">Children<span id="options" className="bottomlight">(2 - 12 yrs)</span></span>
            <button className="plusminus" onClick={() => modifyCount('child', 'increment')}>+</button>
            <span>{childCount}</span>
            <button className="plusminus" onClick={() => modifyCount('child', 'decrement')}>-</button>
          </div>
          <div className="counter">
            <span id="options">Infants<span id="options" className="bottomlight">(Below 2 yrs)</span></span>
            <button className="plusminus" onClick={() => modifyCount('infant', 'increment')}>+</button>
            <span>{infantCount}</span>
            <button className="plusminus" onClick={() => modifyCount('infant', 'decrement')}>-</button>
          </div>
          <div>
          <button className="navBtnNormal" id="navibtn">Economy</button>
          <button className="navBtnNormal">Buisness class</button>
          <button className="navBtnNormal">First class</button>
          <button className="navBtnNormal">Premium economy</button>
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
          <div className="icon"><MdFlightTakeoff /></div>
          <input type="text" placeholder="Where from?" className="navIcon" /></button>
          <MdOutlineSwapHorizontalCircle /> 
          <button className="holding2">
          <MdFlightLand />
          <input type="text" placeholder="Where to?" className="navIcon" />
          </button>
          </div>
          <div className="navSearchDateTime">
           <div> <button className="navSearchDate"><SlCalender /><DatePicker selected={startDate} onChange={(date)=>setStartDate(date)}
            dateFormat="dd, MMMM yyyy" minDate={new Date()}/></button></div>
            <button className="navSearchDate">Return</button>
            <button className="searchBtn">Search flights</button>
          </div>
        </div>
        </div>
    </div>
    </div>
  );
};
export default Navbar