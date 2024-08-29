import React, {useRef, useState, useEffect, useMemo} from 'react';
import "./HotelCardInfo.css";
import Calendar from 'react-calendar';
import LoginSignup from '../smallComp/LoginSignup';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {GiSparkles, GiMeal, GiGymBag } from 'react-icons/gi';
import { CiCalendar } from "react-icons/ci";
import { IoLocationOutline } from "react-icons/io5";
import {MdOutlineVerified, MdRestaurant, MdTableBar, MdOutlineSignalWifi4Bar, MdOutlineFreeCancellation} from 'react-icons/md';
import { FaPersonSwimming, FaSprayCanSparkles } from "react-icons/fa6";
import HotelCardInfoCarousalFirst from '../smallComp/HotelCardInfoCarousalFirst';
import Footer from './Footer';
import { months, days, HotelsCardInfoStatefun, baseAPI } from './Constants';
export default function HotelsCardInfo() {
    const carddivbuttonroom = useRef();
    const navdivbuttonroom = useRef()
    const generalref = useRef();
    const amenitieref = useRef();
    const roomref = useRef();
    const colorrating = useRef([]);
    const colorratinghalf = useRef([]);
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    let hotel_id = searchParams.get("hotel_id");
    let cityparam = searchParams.get("location");
    let adults = JSON.parse(searchParams.get("adults"));
    let childrens = JSON.parse(searchParams.get("childrens"));
    let rooms = searchParams.get("rooms");
    let dayOfWeek = searchParams.get("date");
    const dateObject = new Date(dayOfWeek);
  
    const { details, setdetails } = HotelsCardInfoStatefun();
    const [dataa, setdataa] = useState({});
    const [loader, setloader] = useState(false);
    const [navanimate, setnavanimate] = useState({});
    const [inputvaluehotel, setinputvaluehotel] = useState(cityparam);
    const [inputvaluehotelid, setinputvaluehotelid] = useState(hotel_id);
    const [logincheck, setlogincheck] = useState(false)
    const [datego, setdatego] = useState(dateObject);
    const [daygo, setdaygo] = useState(days[dateObject.getDay()]);
    const [monthgo, setmonthgo] = useState(months[dateObject.getMonth()])
    const [searchhoteldata, setsearchhoteldata] = useState();
    const [toggle, settoggle] = useState(true);
    const [roomcarddetailspop, setroomcarddetailspop] = useState(false);
    const [sidebardata, setsidebardata] = useState({});
    const [color, setcolor] = useState({ "general": true, "amenities": false, "rooms": false })
  
    //----------------------------Active current phases----------------------------
  
    function colorchanger(key) {
      setcolor({})
      setcolor((prev) => ({ ...prev, [key]: true }));
    }
  
    //---------------------------onclick scroll----------------------------
  
    const scrollhandle = (ele) => {
      if (ele.current) {
        window.scrollTo({ top: ele.current.offsetTop - 150, behavior: 'smooth' });
      }
    }
  
    //---------------------------scroll effects-----------------------------
    window.addEventListener("scroll", scrolleffect)
  
    function scrolleffect() {
      if (roomref.current && amenitieref.current && generalref.current) {
        if (window.scrollY >= roomref.current.offsetTop - 151) {
          colorchanger("rooms");
        }
        else if (window.scrollY >= amenitieref.current.offsetTop - 151) {
          colorchanger("amenities");
        }
        else if (window.scrollY >= generalref.current.offsetTop - 151) {
          colorchanger("general");
        }
      }
      if (carddivbuttonroom.current && navdivbuttonroom.current) {
        if (window.scrollY >= carddivbuttonroom.current.offsetTop - 0) {
          navdivbuttonroom.current.style.opacity = 1;
        }
        else if (window.scrollY >= carddivbuttonroom.current.offsetTop - 10) {
          navdivbuttonroom.current.style.opacity = 0.9;
        }
        else if (window.scrollY >= carddivbuttonroom.current.offsetTop - 20) {
          navdivbuttonroom.current.style.opacity = 0.8;
        }
        else if (window.scrollY >= carddivbuttonroom.current.offsetTop - 30) {
          navdivbuttonroom.current.style.opacity = 0.7;
        }
        else if (window.scrollY >= carddivbuttonroom.current.offsetTop - 40) {
          navdivbuttonroom.current.style.opacity = 0.6;
        }
        else if (window.scrollY >= carddivbuttonroom.current.offsetTop - 50) {
          navdivbuttonroom.current.style.opacity = 0.5;
        }
        else if (window.scrollY >= carddivbuttonroom.current.offsetTop - 60) {
          navdivbuttonroom.current.style.opacity = 0.4;
        }
        else if (window.scrollY >= carddivbuttonroom.current.offsetTop - 70) {
          navdivbuttonroom.current.style.opacity = 0.3;
        }
        else if (window.scrollY >= carddivbuttonroom.current.offsetTop - 80) {
          navdivbuttonroom.current.style.opacity = 0.2;
        }
        else if (window.scrollY >= carddivbuttonroom.current.offsetTop - 90) {
          navdivbuttonroom.current.style.opacity = 0.1;
        }
        else {
          navdivbuttonroom.current.style.opacity = 0;
        }
      }
    }
  
    //-------------------------side page closer------------------------- 
  
    function fulldetailpagedirectionchanger() {
      setroomcarddetailspop(!roomcarddetailspop)
    }
  
    //-------------------------popup for navbar-------------------------
  
    function popupnavanimate(key) {
      setnavanimate({});
      setnavanimate((prev) => ({ ...prev, [key]: !navanimate[key] }));
    }
  
    //-------------------------popup for navbar-------------------------
  
    function closedynamicpop(key) {
      setnavanimate((prev) => ({ [prev]: false }))
      setnavanimate((prev) => ({ ...prev, [key]: true }))
    }
  
    //------------------------guests calculator-------------------------
  
    function guestscalc(key1, key2) {
      key1 == "increase" ? setdetails((prev) => ({ ...prev, [key2]: details[key2] + 1 })) : setdetails((prev) => ({ ...prev, [key2]: details[key2] - 1 }));
    }
  
    //------------------------Self Navigate---------------------------
  
    function navigatecurrentpage() {
      navigate(`/hotels/results/hotelInfo?hotel_id=${inputvaluehotelid}&location=${inputvaluehotel}&rooms=${details.room}&adults=${details.adults}&childrens=${details.children}&date=${dateObject}`)
    }
  
    //------------------------blackscreen navbar--------------------------
  
    function trueFinderpop() {
      if (Object.keys(navanimate).length === 0) {
        return 0;
      }
      else {
        return Object.keys(navanimate).length
      }
    }
  
    //-------------------------Navigate to next---------------------------
    function navigatedetailspage() {
      navigate(`/hotels/results/hotelInfo/Info?hotel_id=${dataa._id}&rooms=${rooms}&adults=${adults}&childrens=${childrens}&date=${dayOfWeek}&roomno=${sidebardata.roomNumber}`)
    }
  
    //----------------------Fetch hotel locations for Navbar----------------------
  
    const fetchdataHotelInputFields = async (valuee) => {
      try {
        const response = await (await fetch(`${baseAPI}/hotel?search={"location":"${valuee}"}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
              projectID: "ti65fq50h0gi",
              "Content-Type": "application/json",
            }
          }
        )).json();
        setsearchhoteldata(response.data.hotels);
      } catch (error) {
        alert(error);
      }
    }
  
    //---------------------Fetch Hotels data(Main api)----------------------
  
    const fetchcarddetails = useMemo(async () => {
      try {
        const response = await (await fetch(`${baseAPI}/hotel/${hotel_id}`,
          {
            method: "GET",
            headers: {
              projectID: "ti65fq50h0gi",
              Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
              "Content-Type": "application/json",
            }
          }
        )).json();
        setdataa(response.data)
        setloader(true)
        setTimeout(() => {
          colorratingmanager(response.data.rating);
        }, 1000);
      } catch (error) {
        alert(error);
      }
    }, [toggle])
  
    useEffect(() => {
      fetchdataHotelInputFields(cityparam);
      fetchcarddetails;
  
    }, [])
  
    //---------------------rating with colors----------------------
  
    function colorratingmanager(rating) {
      if (dataa) {
        let count = 1;
        while (count <= rating && colorrating[count - 1]) {
          colorrating[count - 1].style.backgroundColor = "#00aa6c";
          count++;
        }
        let ans = rating % 1;
        if (ans > 0) {
          colorratinghalf[count - 1].style.backgroundColor = "#00aa6c";
        }
      }
    }
  
    return (
      <>
        <div className='hotelcardinfo flex flexc'>
          {roomcarddetailspop && <div className='fullinforoomclearner' onClick={() => { fulldetailpagedirectionchanger() }}></div>}
          {Object.keys(sidebardata).length != 0 &&
            <div className={`sideinforoomdiv flex flexc g20 ${roomcarddetailspop ? "roomcarddetailspopPosition" : ""}`}>
              <div className='flex flexc g10'>
                <svg onClick={() => { fulldetailpagedirectionchanger() }} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" ></svg>
                <div className='flexa roomDetails'><h1>Room Details</h1> <h1>₹{Math.floor(sidebardata.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</h1></div>
               
              </div>
              <h3>RoomNo:</h3>
              <h3>{sidebardata.roomNumber}</h3>
              <h3>Room Type:</h3>
              <p>{sidebardata.roomType}</p>
              <h3>Room Size:</h3>
              <h4>{sidebardata.roomSize}</h4>
              <h3>Bed Details:</h3>
              <h4>{sidebardata.bedDetail}</h4>
              <button className='navigatebtnhotelcardinfo' onClick={() => { navigatedetailspage() }}>Book</button>
  
            </div>
          }
  
          {trueFinderpop() > 0 && <div className={`navbaranimatecloser  ${trueFinderpop() ? "animatedown" : "animateup"}`} onClick={() => { setnavanimate({}) }}></div>}
          {loader &&
            <div className='HotelsResult flexa flexc'>
              <div className={`navbaranimate ${trueFinderpop() > 0 ? "animatedown" : "animateup"} flexja`}>
                <div className='upperCenterdivDynamic flexja b1 g5'>
                  <div className='hotelInputdynamic flexa g10' onClick={(e) => { closedynamicpop("hotel") }} >
                  <IoLocationOutline />
                    <input className='inputdynamic' type='text' value={inputvaluehotel} onChange={(e) => { setinputvaluehotel(e.target.value); fetchdataHotelInputFields(e.target.value) }} />
                    {navanimate["hotel"] && <div className='popdynamichotelInput' onClick={(e) => { e.stopPropagation() }}>
                      {searchhoteldata.map((item, index) => (
                        <div key={index} className='hotelMainPageInput flexa' onClick={(e) => { e.stopPropagation(); setnavanimate({ ["hotel"]: false }); setinputvaluehotel(item.name); setinputvaluehotelid(item._id) }}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" className="dropdown-new__item-stroke--icon listItemHover"><path strokeLinecap="round" strokeLinejoin="round" d="M20 10.182C20 16.546 12 22 12 22s-8-5.454-8-11.818c0-2.17.843-4.251 2.343-5.786A7.91 7.91 0 0 1 12 2c2.122 0 4.157.862 5.657 2.396A8.277 8.277 0 0 1 20 10.182Z" stroke='black'></path><path strokeLinecap="round" strokeLinejoin="round" d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke='black'></path></svg>&nbsp;&nbsp;{item.name}</div>
                      ))}
                    </div>}
                  </div>
                  <div className='dateInputUpperdynamic flexa'>
                  <CiCalendar />
                    <div className='dateInputStaticInnerLeftdynamic flexja g5' onClick={() => { closedynamicpop("goingdate") }}>
                      
                      <p>{`${datego.getDate()} ${daygo}'${datego.getFullYear().toString().match(/\d{2}$/)[0]}`}</p>
                      {navanimate["goingdate"] && <Calendar minDate={new Date()} onChange={(date, e) => { e.stopPropagation(); setnavanimate({ ["goingdate"]: false }); setdatego(date); setdaygo(days[date.getDay()]); setmonthgo(months[date.getMonth()]) }} className="calendarForGoing" />}
                    </div>
                    {/* <div className='datecenterline'></div>
                  <div className='dateInputStaticInnerRightdynamic flexja g5' onClick={() => { closedynamicpop("returndate") }} >
                    <p>{`${datego.getDate()} ${daygo}'${datego.getFullYear().toString().match(/\d{2}$/)[0]}`}</p>
                    {navanimate["returndate"] && <Calendar minDate={datego} onChange={(date, e) => { e.stopPropagation(); setnavanimate({ ["returndate"]: false }); }} className="calendarForGoing" />}
                  </div> */}
                  </div>
                  <div className='roomsAndGuestsdynamic flexja g5' onClick={() => { closedynamicpop("room") }}>
                  <CiCalendar />
                    <p>{details["room"]} room, {details["adults"] + details["children"]} guests</p>
                    {navanimate["room"] && <div className='roomPopDynamic flexa flexc g20'>
                      <div className='flexa'>
                        <div>
                          <h4>Rooms</h4>
                          <p>AC rooms</p>
                        </div>
                        <div className='buttondivguests flexa'>
                          <button className={details["room"] == 1 ? "opacitydecrease" : ""} onClick={() => { guestscalc("decrease", "room") }} disabled={details["room"] == 1}>-</button>
                          <span>{details["room"]}</span>
                          <button className={details["children"] + details["adults"] == details["room"] ? "opacitydecrease" : ""} onClick={() => { guestscalc("increase", "room") }} disabled={details["children"] + details["adults"] == details["room"]}>+</button>
                        </div>
                      </div>
                      <div className='flexa'>
                        <div>
                          <h4>Adults over 12 Years</h4>
                          <p>12+ years</p>
                        </div>
                        <div className='buttondivguests flexa'>
                          <button className={details["adults"] == 1 ? "opacitydecrease" : ""} onClick={() => { guestscalc("decrease", "adults") }} disabled={details["adults"] == 1}>-</button>
                          <span>{details["adults"]}</span>
                          <button onClick={() => { guestscalc("increase", "adults") }}>+</button>
                        </div>
                      </div>
                      <div className='flexa'>
                        <div>
                          <h4>Children</h4>
                          <p>1 - 11 years</p>
                        </div>
                        <div className='buttondivguests flexa'>
                          <button className={details["children"] == 0 ? "opacitydecrease" : ""} onClick={() => { guestscalc("decrease", "children") }} disabled={details["children"] == 0}>-</button>
                          <span>{details["children"]}</span>
                          <button onClick={() => { guestscalc("increase", "children") }} disabled={details["children"] == details["adults"]}>+</button>
                        </div>
                      </div>
                      <button className='guestsDoneButton' onClick={(e) => { e.stopPropagation(); setnavanimate({ ["room"]: false }) }}>Done</button>
                    </div>}
                  </div>
                </div>
                <button onClick={() => { setnavanimate({}); navigatecurrentpage(); settoggle(!toggle) }}>Update</button>
              </div>
  
              {logincheck && <LoginSignup settokenAvailability={settokenAvailability} checklogin={checklogin} formClose={setlogincheck} />}
              <nav className='navFlightResults flexja'>
                <div className='innernav'>
                  <div className='uppernav flexa'>
                    <div className='upperLeftIcons flex'>
                      <Link to="/"><svg width="107" height="24" viewBox="0 0 310 65" fill="none" ></svg></Link>
                    </div>
                    <div className='upperCenterdiv flexja g5'>
                      <div className='hotelInputStatic flexa' onClick={() => { popupnavanimate("hotel") }}>
                      <IoLocationOutline />
                        <p>{cityparam}</p>
                      </div>
                      <div className='dateInputUpperStatic flexa'>
                        <div className='dateInputStaticInnerLeftStatic flexja g5' onClick={() => { popupnavanimate("goingdate") }}>
                        <CiCalendar />
                          <p>{dateObject.getDate()} {days[dateObject.getDay()]}'{dateObject.getFullYear().toString().match(/\d{2}$/)[0]}</p>
                        </div>
                        
                      </div>
                      <div className='roomsAndGuestsStatic flexja g5' onClick={() => { popupnavanimate("room") }}>
                      <CiCalendar />
                        <p>{rooms} room, {adults + childrens} guests</p>
                      </div>
                    </div>
                  </div>
                  <div className='hotelcardinfo-bottomnav flex'>
                    <div className='hotelcardinfo-bottomnavleft flexa'>
                      <a onClick={() => { scrollhandle(generalref) }} className={color["general"] ? "hotelcardinfo-navbottomoptionunderline" : ""}>General</a>
                      <a onClick={() => { scrollhandle(amenitieref) }} className={color["amenities"] ? "hotelcardinfo-navbottomoptionunderline" : ""}>Amenities</a>
                      <a onClick={() => { scrollhandle(roomref) }} className={color["rooms"] ? "hotelcardinfo-navbottomoptionunderline" : ""}>Rooms</a>
                    </div>
                    <div className='hotelcardinfo-bottomnavright flexa' ref={navdivbuttonroom}>
                      <div className='flexa g10'>
                        <del>₹{Math.floor(dataa.avgCostPerNight * 1.2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</del>
                        <div className='flexa'><h1>₹{Math.floor(dataa.avgCostPerNight).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</h1>&nbsp;<p>+₹{Math.floor((dataa.avgCostPerNight * 12) / 100)} tax / night</p></div>
                      </div>
                      <a onClick={() => { scrollhandle(roomref) }} className='flexja'>Select room</a>
                    </div>
  
                  </div>
                </div>
              </nav>
  
              {/* ------------------------------------Main Body----------------------------------------- */}
  
              <div className='hotelcardinfo-mainbody flexa flexc'>
                <div className='hotelcardinfo-box1 flex'>
                  <div className='hotelcardinfo-box1left flexa flexc'>
                    <div id='hotelcardinfo-general' className='flex flexc g20'>
                      <div className='hotelcardinfo-generalheading flexc g10 flex' ref={generalref}>
                        <h1>{dataa.name}&nbsp;-&nbsp;{dataa.location.match(/^([^,]+)/)[1]}</h1>
                        <span>{dataa.amenities.length}-star Hotel,{dataa.location.match(/^([^,]+)/)[1]}</span>
                      </div>
                      <span className='hotelcardinfo-colorratingMain'>
                        {Number.isInteger(dataa.rating) ? `${dataa.rating}.0` : dataa.rating}/5
                        &nbsp; &nbsp;<svg xmlns="http://www.w3.org/2000/svg" width="18" height="12" fill="none" viewBox="0 0 18 12" className="hotelcardinfo-ownlogo"></svg>
                        &nbsp;&nbsp;
                        <div className='hotelcardinfo-colorrating' ref={(e) => { colorrating[0] = e }}><div className='hotelcardinfo-colorratinghalf' ref={(e) => { colorratinghalf[0] = e }}></div></div>
                        <div className='hotelcardinfo-colorrating' ref={(e) => { colorrating[1] = e }}><div className='hotelcardinfo-colorratinghalf' ref={(e) => { colorratinghalf[1] = e }}></div></div>
                        <div className='hotelcardinfo-colorrating' ref={(e) => { colorrating[2] = e }}><div className='hotelcardinfo-colorratinghalf' ref={(e) => { colorratinghalf[2] = e }}></div></div>
                        <div className='hotelcardinfo-colorrating' ref={(e) => { colorrating[3] = e }}><div className='hotelcardinfo-colorratinghalf' ref={(e) => { colorratinghalf[3] = e }}></div></div>
                        <div className='hotelcardinfo-colorrating' ref={(e) => { colorrating[4] = e }}><div className='hotelcardinfo-colorratinghalf' ref={(e) => { colorratinghalf[4] = e }}></div></div>
                      </span>
                      <div className='hotelcardinfo-cancellationdiv'>
                        <div className='flex g10'><div><GiSparkles className='hotelcardinfo-cancellationdivlogo' /></div><div><h4>Cancellation till check-in available</h4><p>With Cancel For No Reason powered by Cleartrip</p></div></div>
                        <div className='flex g10'><div><MdOutlineVerified className='hotelcardinfo-cancellationdivlogo' /></div><div><h4>Best in className service</h4><p>Service at this property rated 5.0</p></div></div>
                        <div className='flex g10'><div><GiMeal className='hotelcardinfo-cancellationdivlogo' /></div><div><h4>Free breakfast on select plans</h4><p>Some plans include free breakfast</p></div></div>
                      </div>
                    </div>
                    <hr />
                    <div id='hotelcardinfo-amenities' ref={amenitieref}>
                      <h2>Amenities</h2>
                      <div className='hotelcardinfo-amenitiesgriddiv'>
                        {dataa.amenities.map((item, index) => (
                          <div key={index} className='flexa456 g10'>{item == "Gym" ? <GiGymBag /> : item == "Swimming Pool" ? <FaPersonSwimming /> : item == "Restaurant" ? <MdRestaurant /> : item == "Bar" ? <MdTableBar /> : item == "Free WiFi" ? <MdOutlineSignalWifi4Bar /> : item == "Spa" ? <FaSprayCanSparkles /> : ""}<p>{item}</p></div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className='hotelcardinfo-box1right flex flexc'>
                    <div className='hotelcardinfo-carousaldiv'>{dataa && <HotelCardInfoCarousalFirst data={dataa.images} />}</div>
                    <div className='hotelcardinfo-prizeinfo flexa' ref={carddivbuttonroom}>
                      <div className='flex flexc g5'>
                        <div className='flexa'><h3>₹{Math.floor(dataa.avgCostPerNight).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</h3>&nbsp;&nbsp; <p>+₹{Math.floor((dataa.avgCostPerNight * 12) / 100)} tax</p> <pre> / night</pre></div>
                        <div className='flexa'><del>₹{Math.floor(dataa.avgCostPerNight * 1.2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</del> &nbsp;<span>52% off</span>&nbsp;<p>No cost EMI from ₹3,933</p></div>
                      </div>
                      <a onClick={() => { scrollhandle(roomref) }}>Select room</a>
                    </div>
                  </div>
                </div>
                {/* ---------------------------------------Instructions for hotel------------------------------------- */}
                <div>
                  <div className='houserulesgriddiv'>
                    <div className='animationrotation1 flex flexc g5'>
                      <h3>Restrictions</h3>
                      <div className='flex g5'><h4>petsAllowed:</h4><p>{dataa.houseRules.restrictions.petsAllowed.toString().toUpperCase()}</p></div>
                      <div className='flex g5'><h4>smokingAllowed:</h4><p>{dataa.houseRules.restrictions.smokingAllowed.toString().toUpperCase()}</p></div>
                    </div>
                    <div className='animationrotation2 flex flexc g5'>
                      <h3>GuestProfile</h3>
                      <div className='flex g5'><h4>unmarriedCouplesAllowed:</h4><p>{dataa.houseRules.guestProfile.unmarriedCouplesAllowed.toString().toUpperCase()}</p></div>
  
                    </div>
                    <div className='animationrotation3 flex flexc g10'>
                      <h3>IdProofRelated</h3>
                      <div className='flex g20'><h4>IdProofsAccepted:</h4><ol>{dataa.houseRules.idProofRelated.idProofsAccepted.map((item, index) => (<li key={index}>{item}</li>))}</ol></div>
                      <div className='flex g5'><h4>LocalIdsAllowed:</h4><p>{dataa.houseRules.idProofRelated.localIdsAllowed.toString().toUpperCase()}</p></div>
                    </div>
                    <div className='animationrotation4 flex flexc g5'>
                      <h3>childAndExtraBedPolicy</h3>
                      <div className='flex g5'><h4>extraBedProvidedForChild:</h4><p>{dataa.childAndExtraBedPolicy.extraBedProvidedForChild.toString().toUpperCase()}</p></div>
                      <div className='flex g5'><h4>extraBedForAdditionalGuest:</h4><p>{dataa.childAndExtraBedPolicy.extraBedForAdditionalGuest.toString().toUpperCase()}</p></div>
                      <div className='flex g5'><h4>extraBedCharge:</h4><p>{dataa.childAndExtraBedPolicy.extraBedCharge}</p></div>
                      <div className='flex g5'><h4>additionalInfo:</h4><p>{dataa.childAndExtraBedPolicy.additionalInfo}</p></div>
                    </div>
                  </div>
                </div>
                <div className='cardsroomsouterdiv flex flexc g20' ref={roomref}>
                  <h1 id='room'>Rooms</h1>
                  
                  <div className='carousaltypecarddiv flex g20'>
                    <div className='cardupperdiv flex g20'>
                      {/* ---------------------------room Cards----------------------------- */}
                      {dataa.rooms.map((item, index) => (
                        <div key={index} className='roomcardhotel flex flexc'>
                          <h2>{item.roomType} Room</h2>
                          <div className='flex flexc g10'>
                            <div className='flexa g10 roomcardhotelbreakfast'><GiMeal className='cardlogofeatures' /><p>Breakfast</p></div>
                            <div className='flexa g10 roomcardhotelcancellation'><MdOutlineFreeCancellation className='cardlogofeatures' /><p>{dataa.rooms[0].cancellationPolicy}</p></div>
                          </div>
                          <div className='flex flexc g5'>
                            <div className='flexa aboutroomupperdiv'>
                              <div className='flexa'>
                                <h3>₹{Math.floor(item.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</h3>&nbsp;&nbsp;
                                <p>+₹{item.costDetails.taxesAndFees} tax</p>
                                <pre> / night</pre>
                              </div>
                              <span className='roomfulldetailsrelative' onClick={() => { fulldetailpagedirectionchanger();; setsidebardata(item) }}> <div className='roomfulldetailsabsolute'>Click me for details</div><svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 c-pointer"><mask id="mask0_3260_299832" maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16"><rect width="16" height="16" fill="#D9D9D9"></rect></mask><g mask="url(#mask0_3260_299832)"><path d="M8 11C8.1 11 8.18067 10.9696 8.242 10.9087C8.30289 10.8473 8.33333 10.7667 8.33333 10.6667V7.65C8.33333 7.56111 8.3 7.486 8.23333 7.42467C8.16667 7.36378 8.08889 7.33333 8 7.33333C7.9 7.33333 7.81933 7.36667 7.758 7.43333C7.69711 7.5 7.66667 7.57778 7.66667 7.66667V10.6833C7.66667 10.7722 7.7 10.8473 7.76667 10.9087C7.83333 10.9696 7.91111 11 8 11ZM8 6.38333C8.11111 6.38333 8.20844 6.34444 8.292 6.26667C8.37511 6.18889 8.41667 6.08889 8.41667 5.96667C8.41667 5.85556 8.37511 5.76111 8.292 5.68333C8.20844 5.60556 8.11111 5.56667 8 5.56667C7.88889 5.56667 7.79156 5.60556 7.708 5.68333C7.62489 5.76111 7.58333 5.85556 7.58333 5.96667C7.58333 6.08889 7.62489 6.18889 7.708 6.26667C7.79156 6.34444 7.88889 6.38333 8 6.38333ZM8 14C7.16667 14 6.38333 13.8444 5.65 13.5333C4.91667 13.2222 4.28067 12.7973 3.742 12.2587C3.20289 11.7196 2.77778 11.0833 2.46667 10.35C2.15556 9.61667 2 8.83333 2 8C2 7.16667 2.15556 6.38333 2.46667 5.65C2.77778 4.91667 3.20289 4.28044 3.742 3.74133C4.28067 3.20267 4.91667 2.77778 5.65 2.46667C6.38333 2.15556 7.16667 2 8 2C8.83333 2 9.61667 2.15556 10.35 2.46667C11.0833 2.77778 11.7196 3.20267 12.2587 3.74133C12.7973 4.28044 13.2222 4.91667 13.5333 5.65C13.8444 6.38333 14 7.16667 14 8C14 8.83333 13.8444 9.61667 13.5333 10.35C13.2222 11.0833 12.7973 11.7196 12.2587 12.2587C11.7196 12.7973 11.0833 13.2222 10.35 13.5333C9.61667 13.8444 8.83333 14 8 14ZM8 13.3333C9.47778 13.3333 10.7362 12.814 11.7753 11.7753C12.814 10.7362 13.3333 9.47778 13.3333 8C13.3333 6.52222 12.814 5.26378 11.7753 4.22467C10.7362 3.186 9.47778 2.66667 8 2.66667C6.52222 2.66667 5.264 3.186 4.22533 4.22467C3.18622 5.26378 2.66667 6.52222 2.66667 8C2.66667 9.47778 3.18622 10.7362 4.22533 11.7753C5.264 12.814 6.52222 13.3333 8 13.3333Z" fill="#1A1A1A"></path></g></svg></span>
                            </div>
                            <div className='flexa'><del>₹{Math.floor(item.price * 1.2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</del> &nbsp;<span>52% off</span>&nbsp;<p>No cost EMI from ₹3,933</p></div>
                          </div>
                          <button className='hotelroombookbutton' onClick={() => { fulldetailpagedirectionchanger(); setsidebardata(item) }}>Book</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
          {!loader && <div className="lds-dual-ring"></div>}
        </div>
        <div className='hotelcardinfofooter'>
          <Footer />
        </div>
      </>
    )
  }

