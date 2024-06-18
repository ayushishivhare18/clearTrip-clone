import React, {useRef, useState, useEffect, useMemo} from 'react';
import "./HotelCardInfo.css";
import Calendar from 'react-calendar';
import LoginSignup from '../smallComp/LoginSignup';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {GiSparkles, GiMeal, GiGymBag } from 'react-icons/gi';
import {MdOutlineVerified, MdRestaurant, MdTableBar, MdOutlineSignalWifi4Bar, MdOutlineFreeCancellation} from 'react-icons/md';
import { faPersonSwimming, faSprayCanSparkles } from '@fortawesome/free-solid-svg-icons';
import CarousalHotelUp from '../smallComp/CarousalHotelUp';
import { Footer } from 'antd/es/layout/layout';
import { months, days, HotelsCardInfoStatefun, baseAPI } from './Constants';

export default function HotelCardInfo(){
    const cardDivButtonRoom = useRef();
    const navDivButtonRoom = useRef();
    const generalRef = useRef();
    const amenityRef = useRef();
    const roomRef = useRef();
    const colorRating = useRef([]);
    const colorRatingHalf = useRef([]);
    const navigate = useNavigate();
    const location = useLocation();
    const searchParam = new URLSearchParams(location.search);
    let hotel_id = searchParam.get("hotel_id");
    let cityParam = searchParam.get("location");
    let adults = JSON.parse(searchParam.get("adults"));
    let childrens = JSON.parse(searchParam.get("childrens"));
    let rooms = searchParam.get("rooms");
    let daysOfWeek = searchParam.get("date");
    const dateObject = new Date(daysOfWeek);

    const {details, setDetails}  =HotelsCardInfoStatefun();
    const [data, setData] = useState({});
    const [loader, setLoader] = useState(false);
    const [navAnimate, setNavAnimate] = useState({});
    const [inputValueHotel, setInputValueHotel] = useState(cityParam);
    const [inputValueHotelId, setInputValueHotelId] = useState(hotel_id);
    const [loginCheck, setLoginCheck] = useState(false);
    const [dateGo, setDateGo] = useState(dateObject);
    const [dayGo, setDayGo] = useState(days[dateObject.getDay()]);
    const [monthGo, setMonthGo] = useState(months[dateObject.getMonth()]);
    const [searchHotelData, setSearchHotelData] = useState();
    const [toggle, setToggle] = useState(true);
    const [roomCardDetailsPop, setRoomCardDetailsPop] = useState(false);
    const [sideBarData, setSideBarData] = useState({});
    const [color, setColor] = useState({"general": true, "aminities": false, "rooms": false});

    function colorChanger(key){
        setColor({})
        setColor((prev) => ({...prev, [key]: true}));
    }

    function scrollHandle (ele){
        if(ele.current){
            window.scrollTo({top: ele.current.offsetTop - 150, behavior: smooth});
        }
    }

    //scroll effects
    window.addEventListener("scroll",scrollEffect)

    function scrollEffect(){
        if(roomRef.current && amenityRef.current && generalRef.current){
            if(window.scrollY >= roomRef.current.offsetTop - 151){
                colorChanger("rooms");
            }
            else if(window.scrollY >= amenityRef.current.offsetTop - 151){
                colorChanger("amenities");
            }
            else if(window.scrollY >= generalRef.current.offsetTop - 151){
                colorChanger("general");
            }    
        }
        if(cardDivButtonRoom.current && navDivButtonRoom.current){
            if(window.scrollY >= cardDivButtonRoom.current.offsetTop - 0){
                navDivButtonRoom.current.style.opacity = 1;
            }
            else if(window.scrollY >= cardDivButtonRoom.current.offsetTop - 10){
                navDivButtonRoom.current.style.opacity = 0.9;
            }
            else if(window.scrollY >= cardDivButtonRoom.current.offsetTop - 20){
                navDivButtonRoom.current.style.opacity = 0.8;
            }
            else if(window.scrollY >= cardDivButtonRoom.current.offsetTop - 30){
                navDivButtonRoom.current.style.opacity = 0.7;
            }
            else if(window.scrollY >= cardDivButtonRoom.current.offsetTop - 40){
                navDivButtonRoom.current.style.opacity = 0.6;
            }
            else if(window.scrollY >= cardDivButtonRoom.current.offsetTop - 50){
                navDivButtonRoom.current.style.opacity = 0.5;
            }
            else if(window.scrollY >= cardDivButtonRoom.current.offsetTop - 60){
                navDivButtonRoom.current.style.opacity = 0.4;
            }
            else if(window.scrollY >= cardDivButtonRoom.current.offsetTop - 70){
                navDivButtonRoom.current.style.opacity = 0.3;
            }
            else if(window.scrollY >= cardDivButtonRoom.current.offsetTop - 80){
                navDivButtonRoom.current.style.opacity = 0.2;
            }
            else if(window.scrollY >= cardDivButtonRoom.current.offsetTop - 90){
                navDivButtonRoom.current.style.opacity = 0.1;
            }else{
                navDivButtonRoom.current.style.opacity = 0;
            }
        }
    }

    function fullDetailPgaeChanger(){
        setRoomCardDetailsPop(!roomCardDetailsPop);
    }

    function popupNavAnimate(key){
        setNavAnimate({});
        setNavAnimate((prev) => ({...prev, [key]: !navAnimate[key]}));
    }

    function closeDynamicPop(key) {
        setNavAnimate((prev) => ({[prev]: false}))
        setNavAnimate((prev) => ({...prev, [key]:true}))
    }
    
    function gusetCalculation(key1, key2){
        key1 == "increase" ? setDetails((prev) = ({...prev, [key2]: details[key2]+1})) : setDetails((prev) => ({...prev, [key2]: details[key2]-1}));
    }

    function navigateCurrentPage(){
        navigate(`/hotels/results/hotelInfo?hotel_id=${inputValueHotelId}&location=${inputValueHotel}&rooms=${details.room}&adults=${details.adults}&childrens=${details.children}&date=${dateObject}`);
    }

    function trueFinderPop() {
        if(Object.keys(navAnimate).length === 0){
            return 0;
        }else{
            return Object.keys(navAnimate).length;
        }
    }

    function navigateDetailsPage(){
        navigate(`/hotels/results/hotelInfo/Info?hotel_id=${data._id}&rooms=${rooms}&adults=${adults}&childrens=${childrens}&date=${daysOfWeek}&roomno=${sideBarData.roomNumber}`)
    }

    //Hotel location from navbar
    const fetchDataHotelInputFields = async(value) =>{
        try{
            const response = await (await fetch(`${baseAPI}/hotel ? search={"location" : "${value}"}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
                    projectID: "ti65fq50h0gi",
                    "Content-type": "application/json",
                }
            }
            )).json();
            setSearchHotelData(response.data.hotels);
        }catch(error){
            alert(error);
        }
    }

    //Fetch Hotel Data
    const fetchCardDetails = useMemo(async ()=>{
        try{
            const response = await (await fetch(`${baseAPI}/hotel/${hotel_id}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
                    projectID : "ti65fq50h0gi",
                    "Content-type": "application/json",
                }
            }
            )).json();
            setData(response.data);
            setLoader(true);
            setTimeout(()=>{
                colorRatingManager(response.data.rating);
            }, 1000);
        }catch(error){
            alert(error);
        }
    },[toggle])

    useEffect(() =>{
        fetchDataHotelInputFields(cityParam);
        fetchCardDetails;
    },[]);

    //rating with colors
    function colorRatingManager(rating){
        if(data){
            let count = 1;
            while (count<= rating && colorRating[count-1]){
                colorRating[count -1 ].style.backgroundColor = "00aa6c";
                count++;
            }
            let ans = rating % 1;
            if(ans > 0){
                colorRatingHalf[count -1].style.backgroundColor = "00aa6c";
            }
        }
    }




    return(
        <>
        <div className='hotelCardInfo'>
            {roomCardDetailsPop && <div className='fullInfoRoom' onClick={() => {fullDetailPgaeChanger}}></div>}
            {Object.keys(sideBarData).length != 0 &&
            <div className={`sideInfoRoomDiv ${roomCardDetailsPop ? "roomCardDetailsPopPosition" : ""}`}>
                <div>
                    <svg onClick={() => {fullDetailPgaeChanger()}} width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'></svg>
                    <div><h1>Room Details</h1> <h1>₹{Math.floor(sideBarData.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</h1></div>
                    <line/>
                </div>
                <h3>Room no.:</h3>
                <h3>{sideBarData.roomNumber}</h3>
                <h3>Room type:</h3>
                <h3>{sideBarData.roomType}</h3>
                <h3>Room size:</h3>
                <h3>{sideBarData.roomSize}</h3>
                <h3>Bed details:</h3>
                <h3>{sideBarData.bedDetails}</h3>
                <button className='navigateBtnHotelCardInfo' onClick={() => {navigateDetailsPage()}}>Book</button>
            </div>
            }
            {trueFinderPop() > 0 && <div className={`navbarAnimateCloser ${trueFinderPop() ? "animateDown" : "animateUp"}`} onClick={() => {setNavAnimate({})}}></div>}
            {loader &&
            <div className='hotelResult'>
                <div className={`navbarAnimate ${trueFinderPop() > 0 ? "animateDown" : "animateUp"}flex`}>
                    <div className='upperCenterDivDynamic b1 g5'>
                        <div className='hotelInputDynamic g10' onClick={(e) => {closeDynamicPop("hotel")}}>
                            <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'></svg>
                            <input className='inputDynamic' type='text' value={inputValueHotel} onChange={(e) => {setInputValueHotel(e.target.value); fetchDataHotelInputFields(e.target.value)}}/>
                            {navAnimate["hotel"] && <div className='popDynamicHotelInput' onClick={(e) => {e.stopPropagation()}}>
                                {searchHotelData.map((item, index) => (
                                    <div key={index} className='hotelMainPageInput' onClick={(e) => {e.stopPropagation(); setNavAnimate({["hotel"]: false}); setInputValueHotel(item.name); setInputValueHotelId(item._id)}}><svg xmlns='http://www.w3.org/2000/svg' className='listItemHover'></svg></div>
                                ))}
                                </div>}
                        </div>
                        <div className='dateInputUpperDynamic'>
                            <div className='dateInputStaticInnerLeftDynamic g5' onClick={() => {closeDynamicPop("goingdate")}}>
                                <svg xmlns='http://www.w3.org/2000/svg'></svg>
                                <p>{`${dateGo.getDate()} ${dayGo} ${dateGo.getFullYear().toString().match(/\d{2}$/)[0]}`}</p>
                                {navAnimate["goingDate"] && <Calendar minDate={new Date()} onChange={(date, e) => {e.stopPropagation(); setNavAnimate({["goingDate"] : false}); setDateGo(date); setDayGo(days[date.getDay()]); setMonthGo(months[date.getMonth()])}}className='calenderForGoing'/>}
                            </div>
                        </div>
                        <div className='roomAndGuestDynamic' onClick={() => {closeDynamicPop("room")}}>
                            <svg xmlns='http://www.w3.org/2000/svg'></svg>
                            <p>{details["room"]} room, {details["adults"] + details["children"]} guests</p>
                            {navAnimate["room"] && <div className='roompopDynamic'>
                                <div className='flex'>
                                <div>
                                    <h4>Rooms</h4>
                                    <p>AC rooms</p>
                                </div>
                                <div className='buttondivGuests'>
                                    <button className={details["room"] == 1 ? "opacityDecrese" : ""} onClick={() => {gusetCalculation("decrese", "room")}} disabled={details["room"] == 1}>-</button>
                                    <span>{details["room"]}</span>
                                    <button className={details["children"] + details["adults"] == details["room"] ? "opacityDecrese" : ""} onClick={() => {gusetCalculation("increase", "room")}} disabled={details["children"] + details["adults"] == details["room"]}>+</button>
                                </div>
                                </div>
                                <div className='flex'>
                                    <div>
                                        <h4>Adults over 12 years</h4>
                                        <p>12+ years</p>
                                    </div>
                                    <div className='buttondivGuests'>
                                        <button className={details["adults"] == 1 ? "opacityDecrease" : ""} onClick={() => {gusetCalculation("decrese", "adults")}} disabled = {details["adults"] == 1}>-</button>
                                        <span>{details["adults"]}</span>
                                        <button onClick={() => {gusetCalculation("increse", "adult")}}>+</button>
                                    </div>
                                    
                                </div>
                                <div className='flex'>
                                    <div>
                                        <h4>Childrens</h4>
                                        <p>1 - 11 years</p>
                                    </div>
                                    <div className='buttondivGuests'>
                                        <button className={details["children"] == 0 ? "opacityDecrease" : ""} onClick={() => {gusetCalculation("decrese", "children")}} disabled = {details["children"] == 1}>-</button>
                                        <span>{details["children"]}</span>
                                        <button onClick={() => {gusetCalculation("increse", "children")}} disabled={details["children"] == details["adults"]}>+</button>
                                    </div>    
                                </div>
                                <button className='guestsdoneButton' onClick={(e) => {e.stopPropagation(); setNavAnimate({["rooms"] : false})}}>Done</button>

                                </div>}
                        </div>
                    </div>
                    <button onClick={() => {setNavAnimate({}); navigateCurrentPage(); setToggle(!toggle)}}>Update</button>
                </div>
                {loginCheck && <LoginSignup setTokenAvailibility={setTokenAvailibility} checkLogin={checkLogin} formClose={setLoginCheck}/>}
                <nav className='navFlightResults'>
                    <div className='innerNav'>
                        <div className='upperNav'>
                            <div className='upperLeftIcons'>
                                <Link to="/"><svg width='104' height='24' viewBox='0 0 310 65'></svg> </Link>
                            </div>
                            <div className='upperCenterDiv'>
                                <div className='hotelInputStatic' onClick={() => {popupNavAnimate("hotel")}}>
                                    <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'></svg>
                                    <p>{cityParam}</p>
                                </div>
                            
                            <div className='roomsAndGuestsStatic' onClick={() => {popupNavAnimate("room")}}>
                            <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'></svg>
                                    <p>{rooms} room, {adults + childrens}guests</p>
                            </div>
                        </div>
                    </div>
                    <div className='hotelCardInfo-bottomNav'>
                        <div className='hotelCardInfo-bottomNavLeft'>
                            <a onClick={() => {scrollHandle(generalRef)}} className={color["general"] ? "hotelCardInfo-navBottomOptionUnderline": ""}>General</a>
                            <a onClick={() => {scrollHandle(amenityRef)}} className={color["aminities"] ? "hotelCardInfo-navBottomOptionUnderline": ""}>Aminities</a>
                            <a onClick={() => {scrollHandle(roomRef)}} className={color["room"] ? "hotelCardInfo-navBottomOptionUnderline": ""}>Rooms</a>
                        </div>
                        <div className='hotelCardInfoBottomNavRight' ref={navDivButtonRoom}>
                            <div className='flex g10'>
                                <del>₹{Math.floor(data.avgCostPerNight * 1.2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</del>
                                <div className='flex'><h1>₹{Math.floor(data.avgCostPerNight).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</h1>&nbsp;<p>+₹{Math.floor((data.avgCostPerNight*12)/100)}tax/night</p></div>
                            </div>
                            <a onClick={() => {scrollHandle(roomRef)}}>Select Room</a>
                        </div>
                    </div>
                    </div>
                </nav>
                
                <div className='hotelCardInfo-mainBody'>
                    <div className='hotelCardInfo-box1'>
                    <div className='hotelCardInfo-box1-left'>
                        <div className='flex g20' id='hotelCardIngo-general'>
                            <div className='hotelCardIngo-general-heading flex g10' ref={generalRef}>
                                <h1>{data.name}&nbsp;-&nbsp;{data.location.match(/^([^,]+)/)[1]}</h1>
                                <span>{data.aminities.length}-star Hotel, {data.location.match(/^([^,]+)/)[1]}</span>
                            </div>
                            <span className='flex'>
                                {Number.isInteger(data.rating) ? `${data.rating}.0` : data.rating}/5
                                &nbsp; &nbsp;<svg xmlns='http://www.w3.org/2000/svg' width='18' height='12' viewBox='0 0 18 12' className='hotelCardInfologo'></svg>
                                &nbsp;&nbsp;
                                <div className='hotelCardInfo-colorRating' ref={(e) => {colorRating[0] = e}}><div className='hotelcardInfo-colorRatinghalf' ref={(e) => {colorRatingHalf[0] = e}}></div></div>
                                <div className='hotelCardInfo-colorRating' ref={(e) => {colorRating[1] = e}}><div className='hotelcardInfo-colorRatinghalf' ref={(e) => {colorRatingHalf[1] = e}}></div></div>
                                <div className='hotelCardInfo-colorRating' ref={(e) => {colorRating[2] = e}}><div className='hotelcardInfo-colorRatinghalf' ref={(e) => {colorRatingHalf[2] = e}}></div></div>
                                <div className='hotelCardInfo-colorRating' ref={(e) => {colorRating[3] = e}}><div className='hotelcardInfo-colorRatinghalf' ref={(e) => {colorRatingHalf[3] = e}}></div></div>
                                <div className='hotelCardInfo-colorRating' ref={(e) => {colorRating[4] = e}}><div className='hotelcardInfo-colorRatinghalf' ref={(e) => {colorRatingHalf[4] = e}}></div></div>
                            </span>
                            <div className='hotelCardInfo-cancellationDiv'>
                                <div className='flex g10'><div><GiSparkles className='hotelCardInfo-cancellationDivlogo'/> </div><div><h4>Cancellation till check-in available</h4><p>With cancel for no reason powered by clearTrip isko change karna hai</p></div></div>
                                <div className='flex g10'><div><MdOutlineVerified className='hotelCardInfo-cancellationDivlogo'/> </div><div><h4>Best in className service</h4><p>Service at this property rated 5.0</p></div></div>
                                <div className='flex g10'><div><GiMeal className='hotelCardInfo-cancellationDivlogo'/> </div><div><h4>Free breakfast on select plans</h4><p>Some plans include free breakfast</p></div></div>
                            </div>
                        </div>
                        <hr/>
                        <div className='hotelCardInfo-amenities' ref={amenityRef}>
                            <h2>Amenities</h2>
                            <div className='hotelCardInfo-amenitiesGridDiv'>
                                {data.aminities.map((item, index) => (
                                    <div key={index} className='flex g10'>{item == "Gym" ? <GiGymBag/> : item == "Swimming Pool" ? <faPersonSwimming/> : item == "Restaurant" ? <MdRestaurant/> : item == "Bar" ? <MdTableBar/> : item == "Free WiFi" ? <MdOutlineSignalWifi4Bar/> : item == "Spa" ? <faSprayCanSparkles/> : ""}<p>{item}</p></div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className='hotelCardInfo-box1right flex'>
                        <div className='hotelCardInfo-carousalDiv'>{data && <CarousalHotelUp data={data.images}/>}</div>
                        <div className='hotelCardInfo-priceName flex' ref={cardDivButtonRoom}>
                            <div className='flex g5'>
                                <div className='flex'><h3>₹{Math.floor(data.avgCostPerNight).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</h3>&nbsp;&nbsp; <p>+₹{Math.floor((data.avgCostPerNight*12)/100)} tax</p> <pre> /night</pre></div>
                                <div className='flex'><del>₹{Math.floor(data.avgCostPerNight * 1.2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</del>&nbsp;<span>52% OFF</span>&nbsp; <p>No cost EMI from  ₹3,933</p></div>
                            </div>
                            <a onClick={() => {scrollHandle(roomRef)}}>Select room</a>
                        </div>
                    </div>
                    </div>
                    
                    <div>
                        <div className='houseRulesGridDiv'>
                            <div className='animationRotation1 flex g5'>
                                <h3>Restrictions</h3>
                                <div className='flex g5'><h4>petsAllowed:</h4> <p>{data.houseRules.restrictions.petsAllowed.toString().toUpperCase()}</p></div>
                                <div className='flex g5'><h4>smokingAllowed:</h4> <p>{data.houseRules.restrictions.smokingAllowed.toString().toUpperCase()}</p></div>
                            </div>
                            <div className='animationRotation2 flex g5'>
                                <h3>GuestProfile</h3>
                                <div className='flex g5'><h4>unmarriedCouplesAllowed:</h4> <p>{data.houseRules.unmarriedCouplesAllowed.toString().toUpperCase()}</p></div>
                            </div>
                            <div className='animationRotation3 flex g5'>
                                <h3>IdProof</h3>
                                <div className='flex g5'><h4>IdProofsAccepted:</h4> <ol>{data.houseRules.IdProof.IdProofsAccepted.map((item, index) => (<li key={index}>{item}</li>))}</ol></div>
                                <div className='flex g5'><h4>localIdsAllowed:</h4> <p>{data.houseRules.IdProof.localIdsAllowed.toString().toUpperCase()}</p></div>
                            </div>
                            <div className='animationRotation4 flex g5'>
                                <h3>childAndExtraBedPolicy</h3>
                                <div className='flex g5'><h4>extraBedProvidedForChild:</h4> <p>{data.childAndExtraBedPolicy.extraBedProvidedForChild.toString().toUpperCase()}</p></div>
                                <div className='flex g5'><h4>extraBedForAdditionalGuest:</h4> <p>{data.childAndExtraBedPolicy.extraBedForAdditionalGuest.toString().toUpperCase()}</p></div>
                                <div className='flex g5'><h4>extraBedCharge:</h4> <p>{data.childAndExtraBedPolicy.extraBedCharge}</p></div>
                                <div className='flex g5'><h4>additionalInfo:</h4> <p>{data.childAndExtraBedPolicy.additionalInfo}</p></div>
                            </div>
                        </div>
                    </div>
                    <div className='cardRoomOuterDiv flex g20' ref={roomRef}>
                        <h1 id='room'>Rooms</h1>
                        <div className='carousalTypeCardDiv flrx g20'>
                            <div className='cardUpperDiv flex g20'>
                                {data.rooms.map((item, index) => (
                                    <div key={index} className='roomCardHotel flex'>
                                        <h2>{item.roomType} Room</h2>
                                        <div className='flex g10'>
                                            <div className='roomCardHotelBreakfast flex g10'><GiMeal className='cardLogoFeature'/><p>Breakfast</p></div>
                                            <div className='roomCardHotelCancellation flex g10'><MdOutlineFreeCancellation className='cardLogoFeature'/><p>{data.rooms[0].canellationPolicy}</p></div>
                                        </div>
                                        <div className='flex g5'>
                                            <div className='roomUpperDiv'>
                                                <div className='flex'>
                                                    <h3>₹{Math.floor(item.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</h3>&nbsp;&nbsp;
                                                    <p>+₹{item.costDetails.taxesAndFees} tax</p>
                                                    <pre> / night</pre>
                                                </div>
                                                <span className='roomFullDetailsRelative' onClick={() => {fullDetailPgaeChanger();; setSideBarData(item)}}><div className='roomFullDetailsAbsolute'>Click me for Details</div><svg width='20' height='20' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'></svg></span>
                                            </div>
                                            <div className='flex'><del>₹{Math.floor(item.price*1.2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</del>&nbsp;<span>52% off</span>&nbsp;<p>No cost EMI from ₹3,933</p></div>
                                        </div>
                                        <button className='hotelRoomBookButton' onClick={() => {fullDetailPgaeChanger(); setSideBarData(item)}}>Book</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            }
            {!loader && <div></div>}
        </div>
        <div className='hotelCardInfoFooter'>
            <Footer/>
        </div>
        </>
    )
}
