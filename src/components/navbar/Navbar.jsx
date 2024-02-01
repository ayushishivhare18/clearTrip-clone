
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
import { useState } from "react";

const date = ()=>{
  const [openDate, setOpenDate] = useState(false)
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [openOptions, setOpenOptions] = useState(false);
  const [options, setOptions] = useState({
    Adult: 1,
    Children: 0,
    Infants: 0,
  });
}

export const Navbar = () => {
  return (
    <div className="navbar">
      <div className="navContainer">
      <div className="navList">

        <div className="navListItem">
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
        <h1>Search flights</h1>
        <p>Enjoy hassle free bookings with Cleartrip</p>
        </div>
        <div className="middleBox">
        <div className="dropdownItem">
        <GoArrowRight />One way <RiArrowDropDownLine />
        </div>
        <div className="dropdownItem">
        <IoPersonOutline />1Adult,Economy <RiArrowDropDownLine />
        <div className="options">
          <div className="optionItems">
            <span className="optionText">Adult</span>
            <span className="optionText">(12+ Years)</span>
            <button className="optionCounterButton">-</button>
            <span className="optionCounterNumber">1</span>
            <button className="optionCounterButton">+</button>
          </div>
        </div>
        </div>
        <div className="navBtnNormal">
          <button>Regular fare</button>
          <button>Senoir citizen fare</button>
          <button>Student fare</button>
          <button>Armed forces fare</button>
        </div>
        <div className="navBtn">
          <div className="navSearchItem">
          <MdFlightTakeoff />
          <input type="text" placeholder="Where from?" className="navIcon" />
          <MdOutlineSwapHorizontalCircle />
          <MdFlightLand />
          <input type="text" placeholder="Where to?" className="navIcon" />
          </div>
          <div className="navSearchDate">
            <button><SlCalender />date</button>
            <button>Return</button>
            <button className="searchBtn">Search flights</button>
          </div>
        </div>
        </div>
    </div>
    </div>
  )
}
export default Navbar