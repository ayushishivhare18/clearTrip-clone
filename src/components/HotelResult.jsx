import React, { useState, useEffect, useMemo, Children} from 'react';
import LoginSignup from '../smallComp/LoginSignup';
import { useNavigate, Link, NavLink, useLocation } from 'react-router-dom';
import './HotelResult.css';
import { useAuthContext } from './ContextAllData';
import Calendar from 'react-calendar';
import MultiRangesSlider from 'multi-range-slider-react';
import HotelResultCardCarousal from '../smallComp/HotelResultCardCarousal';
import Footer from './Footer';
import { months, days, detailsStatefun, filterStatefun, baseAPI } from './Constants';
import { fi } from 'date-fns/locale';

export default function HotelResult(){
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    let cityParam = searchParams.get("location");
    let daysOfWeek = searchParams.get("daysofweek");
    let adult = JSON.parse(searchParams.get("adults"));
    let childrens = JSON.parse(searchParams.get("childrens"));
    let rooms = searchParams.get("rooms");
    const dateObject = new Date(daysOfWeek);

    const {filter, setFilter} = filterStatefun();
    const {all, setAll} = useAuthContext();
    const {details, setDetails} = detailsStatefun();
    const [tokenAvailibility, setTokenAvailibility] = useState();
    const [loginCheck, setLoginCheck] = useState(false)
    const [searchHotelData, setSearchHotelData] = useState();
    const [inputValue, setInputValue] = useState(cityParam);
    const [staticInput, setStaticInput] = useState(cityParam);
    const [profileToggle, setProfileToggle] = useState(false);
    const [navAnimate, setNavAnimate] = useState({});
    const [dateGo, setDateGo] = useState(dateObject);
    const [dayGo, setDayGo] = useState(days[dateObject.getDay()]);
    const [monthGo, setMonthGo] = useState(months[dateObject.getMonth()])
    const [datere, setDatere] = useState(dateObject)
    const [dayre, setDayre] = useState(days[dateObject.getDay()])
    const [monthre, setMonthre] = useState(months[dateObject.getMonth()]);
    const [pagination, setPagination] = useState(1);
    const [pop, setPop] = useState({});
    const [toggle, setToggle] = useState(true);
    const [data, setData] = useState([]);
    const [loader, setLoader] = useState(false);
    const [totalElementsForPagination, setTotalElementsForPagination] = useState();

    function filter(){
        setPop({});
        setToggle(!toggle);
    }

    function popp(key){
        setPop({});
        setPop({[key]: !pop[key]});

    }
    function maxRangeSetter(value){
        setFilter((prev) => ({...prev, ["priceHigh"]: value}));
    }

    function minRangeSetter(value){
        setFilter((prev) => ({...prev, ["priceLow"]: value}));
    }

    function filterChanger(key, value){
        if(value == filter[key]){
            setFilter((prev) => ({...prev, [key]: ""}));
        }else{
            setFilter((prev) => ({...prev, [key]: value}));
        }
    }

    function filterChangerForRating(key, value){
        if(value == filter[key]){
            setFilter((prev) => ({...prev, [key]: "1"}));
        }else{
            setFilter((prev) => ({...prev, [key]: value}));
        }
    }

    function guestsCalc(key1, key2){
        key1 == "increase" ?
        setDetails((prev) => ({...prev, [key2]: details[key2] +1 })) :
        setDetails((prev) => ({...prev, [key2]: details[key2] -1 }));
    }

    function popUpNavAnimate(key){
        setNavAnimate({});
        setNavAnimate((prev) => ({...prev, [key]: !navAnimate[key]}));
    }

    function closedDynamicPop(){
        setNavAnimate((prev) => ({[prev]: false}));
        setNavAnimate((prev) => ({...prev, [key]: true}));
    }

    function trueFinderPop(){
        if(Object.keys(navAnimate).length === 0){
            return 0;
        }
        else{
            return Object.keys(navAnimate).length;
        }
    }

    function finishToken(){
        localStorage.removeItem("token");
        setTokenAvailibility(false);
        checkLogin();
    }

    function checkLogin(){
        const token = JSON.parse(localStorage.getItem("token")) || []
        if(typeof token === "string"){
            setTokenAvailibility(true);
        }
    }

    function navigateCurrentPage(){
        navigate(`/hotels/result?location=${inputValue.match(/^([^,]+)/)[1]}&rooms=${details.room}&adults=${details.adults}&childrens=${details.children}&date=${dateGo}`)
    }

    function navigateCardInfo(hotel_id){
        if(localStorage.getItem("token")){
            navigate(`/hotels/results/hotelInfo?hotel_id=${hotel_id}&location=${cityparam}&rooms=${details.room}&adults=${details.adults}&childrens=${details.children}&date=${dateObject}`)
        }
        else{
            setLoginCheck(true);
        }
    }

    const fetchDataHotelInputFields = async(value) =>{
        try{
            const response = await (await fetch(`${baseAPI}/hotel?search={"location":"${value}"}`,
            {
                method: "GET",
                    headers: {
                        projectID: "ti65fq50h0gi",
                        "Content-Type": "application/json",
                    }
            }
            )).json();
            setSearchHotelData(response.data.hotel);
           
        }catch(error){
            alert(error);
        }
    }

    function sortingIncreaseOrDecrease(value){
        if(filter.priceHighLow == ""){
            return value;
        }
        else if(filter.priceHighLow == "highToLow"){
            return value.sort((a,b) =>b.avgCostPerNight - a.avgCostPerNight);
        }
        else if (filter.priceHighLow == "lowToHigh"){
            return value.sort((a,b) =>a.avgCostPerNight - b.avgCostPerNight);
        }
    }

    //fetch hotel data
    const fetchMainDataHotels = useMemo(async ()=>{
        try{
            setLoader(false);
            const response = await (await fetch(`${baseAPI}/hotel?search={"location":"${cityParam}"}&filter={"rating":{"$gte":"${filter["rating"]}"}}&limit=10&page=${pagination}`,
            {
                method: "GET",
                headers: {
                    projectID: "ti65fq50h0gi",
                    "Content-Type": "application/json",
                }
            }
            )).json();
            setTotalElementsForPagination(response.totalResults);
            setData(sortingIncreaseOrDecrease(response.data.hotel));
            setLoader(true);
        }catch(error){
            alert(error);
        }
    },[toggle, cityParam, pagination]);

    useEffect(() => {
        fetchDataHotelInputFields("");
        fetchMainDataHotels;
        checkLogin();
    },[]);

    return(
        <>
        <div className='hotelResult mainHotelResult'>
            {trueFinderPop() > 0 && <div className={`navBarAnimateCloser ${trueFinderPop() ? "animateDown" : "animateUp"}`} onClick={() => {setNavAnimate({}) }}></div>}
            {pop [`${Object.keys(pop)[0]}`] == true && <div className='filterPopCloser' onClick={() => {setPop({})}}></div>}
            <div className={`navBarAnimate ${trueFinderPop() > 0 ? "animateDown" : "animateUp"} flex`}>
                <div className='upperCenterDivDynamic flex b1 g5'>
                    <div>
                        <div className='hotelInputDunamic flex g10' onClick={(e) => {closedDynamicPop("hotel")}}>
                            <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'></svg>
                            <input className='inputDynamic' type='text' value={inputValue} onChange={(e) => {setInputValue(e.target.value); fetchDataHotelInputFields(e.target.value)}}/>
                            {navAnimate["hotel"] && <div className='popDynamicHotelInput' onClick={(e) => {e.stopPropagation() }}>
                                {searchHotelData.map((item, index) => (
                                    <div key={index} className='hotelMainPageInput' onClick={(e) => {e.stopPropagation(); setNavAnimate({["hotel"] : false}); setInputValue(item.location)}}><svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'></svg>&nbsp;&nbsp;{item.location}</div>
                                ))}
                                </div>}
                        </div>
                        <div className='dateInputUpperDynamic'>
                            <div className='dateInputStaticInnerLeftDynamic' onClick={() => {closedDynamicPop("goingDate")}}></div>
                            <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'></svg>
                            <p>{`${dateGo.getDate()} ${dayGo}'${dateGo.getFullYear().toString().match(/\d{2}$/)[0]}`}</p>
                            {navAnimate["goingDate"] && <Calendar minDate={new Date()} onChange={(date, e) =>{e.stopPropagation(); setNavAnimate({["goingDate"]: false}); setDateGo(date); setDayGo(days[date.getDay()]); setMonthGo(months[date.getMonth()]) }} className="calenderForGoing"/>}
                        </div>
                    </div>
                    <div className='roomsAndGuestsDynamic' onClick={() => {closedDynamicPop("room")}}>
                    <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'></svg>
                    <p>{details["room"]} room, {details["adults"] + details["children"]} guests</p>
                    {navAnimate["room"] && <div className='roomPopDynamic flex g20'>
                        <div className='flex'>
                            <div>
                                <h4>Rooms</h4>
                                <p>AC rooms</p>
                            </div>
                            <div className='buttonDivGuests flex'>
                                <button className={details["room"] == 1 ? "opacityDecrese" : ""} onClick={() => {guestsCalc("decrease", "room")}} disabled={details["room"] == 1}>-</button>
                                <span>{details["room"]}</span>
                                <button className={details["children"] + details["adults"] == details["room"] ? "opacityDecrese" : ""} onClick={() => {guestsCalc("increase", "room")}} disabled={details["children"] + details["adults"]== details["room"]}>+</button>
                            </div>
                        </div>
                        <div className='flex'>
                            <div>
                                <h4>Adults over 12 Years</h4>
                                <p>12+ years</p>
                            </div>
                            <div className='buttonDivGuests'>
                            <button className={details["adults"] == 1 ? "opacityDecrese" : ""} onClick={() => {guestsCalc("decrease", "adults")}} disabled={details["adults"] == 1}>-</button>
                                <span>{details["adults"]}</span>
                                <button onClick={() => {guestsCalc("increase", "adults")}} >+</button>
                            </div>
                        </div>
                        <div className='flex'>
                            <div>
                                <h4>Children</h4>
                                <p>1 - 11 years</p>
                            </div>
                            <div className='buttonDivGuests'>
                            <button className={details["children"] == 1 ? "opacityDecrese" : ""} onClick={() => {guestsCalc("decrease", "children")}} disabled={details["children"] == 0}>-</button>
                                <span>{details["children"]}</span>
                                <button onClick={() => {guestsCalc("increase", "children")}} disabled={details["children"] == details["adults"]}>+</button>
                            </div>
                        </div>
                        <button className='guestsDoneButton' onClick={(e) => {e.stopPropagation(); setNavAnimate({ ["room"]: false})}}>Done</button>

                        </div>}
                    </div>
                </div>
            </div>
            <button onClick={() => {setNavAnimate({}); navigateCurrentPage(); }}>Update</button>
        </div>

        {loginCheck && <LoginSignup setTokenAvailibility={setTokenAvailibility} checkLogin={checkLogin} formClose={setLoginCheck}/>}
        <nav className='navFlightResult'>
            <div className='innerNav'>
                <div className='upperNav'>
                    <div className='upperLeftIcons'>
                        <Link to="/"><svg width='107' height='24' viewBox='0 0 310 65'></svg></Link>
                    </div>
                    <div className='upperCenterDiv'>
                        <div className='hotelInputStatic' onClick={() => {popUpNavAnimate("hotel")}}>
                        <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'></svg>
                        <p>{cityParam}</p>
                        </div>
                        <div className='dateInputUpperStatic'>
                            <div className='dateInputStaticInnerLeftStatic' onClick={() => {popUpNavAnimate("goingDate")}}>
                            <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'></svg> 
                            <p>{dateObject.getDate()} {days[dateObject.getDay()]}'{dateObject.getFullYear().toString().match(/\d{2}$/)[0]}</p>
                            </div>
                        </div>
                        <div className='roomsAndGuestsStatic' onClick={() => {popUpNavAnimate("room")}}>
                        <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'></svg>
                        <p>{rooms} room, {adult + childrens} guests</p>
                        </div>
                    </div>
                    <div className='upperRightIcon'>
                        <nav className='navUpperHome'>
                            {!tokenAvailibility && <button className='loginOutBtn' onClick={() => setLoginCheck(true)}>Log in / Sign up</button>}
                            {tokenAvailibility && <button className='profileBtn' onClick={(e) => {setProfileToggle(!profileToggle)}}>
                                {JSON.parse(localStorage.getItem("userName"))}
                                {profileToggle && 
                                <div className='profilePop'>
                                    <div className='profileSelectorDiv'>
                                        <div className='profileSelectorLeft'>
                                            <h5>Account</h5>
                                            <NavLink to="/bookedDetails"><p className='profileSelectors'>Trips</p></NavLink>
                                            <NavLink to="/under-maintainance"><p className='profileSelectors'>Shortlists</p></NavLink>
                                            <NavLink to="/under-maintainance"><p className='profileSelectors'>Travellers</p></NavLink>
                                            <NavLink to="/under-maintainance"><p className='profileSelectors'>Cleartrip Wallet</p></NavLink>
                                            <NavLink to="/under-maintainance"><p className='profileSelectors'>Expressway</p></NavLink>
                                            <NavLink to="/under-maintainance"><p className='profileSelectors'>Profile</p></NavLink>
                                            <NavLink to="/under-maintainance"><p className='profileSelectors'>Settings</p></NavLink>
                                            <NavLink to="/under-maintainance"><p className='profileSelectors'>ShortLists</p></NavLink>
                                        </div>
                                        <div className='profileSelectorRight'>
                                            <h5>Quick tools</h5>
                                            <NavLink to="/under-maintainance"><p className='profileSelectors rightSide'>Cancellations</p></NavLink>
                                            <NavLink to="/under-maintainance"><p className='profileSelectors rightSide'>Change flight</p></NavLink>
                                            <NavLink to="/under-maintainance"><p className='profileSelectors rightSide'>Print ticket</p></NavLink>
                                            <NavLink to="/under-maintainance"><p className='profileSelectors rightSide'>Print hotel voucher</p></NavLink>
                                        </div>
                                    </div>
                                    <div className='signOutBtn' onClick={() => {finishToken(); setAll((prev) => ({...prev, ["token"]: ""}))}}>Sign out</div>
                                </div>
                                }
                                </button>}
                        </nav>
                    </div>
                </div>
                <div className='hotelResultDownNav'>
                    <div className='hotelResult-recommend' onClick={() => {pop("highLow")}}>
                        <p>Sort by: Recommended</p>&nbsp;&nbsp;
                        <svg width='14' height='9' fill='currentColor' className={`t-all ml-3 ${pop["hoghLow"] ? "rotateButtonZero" : "rotateButtonOneNinty"}`} style={{color: "rgb(153, 153, 153)", transform: "rotate(-180deg)"}}></svg>
                        {pop["highLow"] && <div className='hotelResult=recommend-pop flex g20' onClick={(e) => {e.stopPropagation();}}>
                        <h3>Sort hotels by</h3>
                        <div className='flex g20'>
                            <div className='flex g5' onClick={() => {filterChanger("priceHighLow", "hightoLow")}}><div className='relativeColorInput'><div className={`absoluteColorDiv ${filter["priceHighLow"] == "hightoLow" ? "blackBackground" : ""}`}></div></div><p>Price: High to Low</p></div>
                            <div className='flex g5' onClick={() => {filterChanger("priceHighLow", "lowtoHigh")}}><div className='relativeColorInput'><div className={`absoluteColorDiv ${filter["priceHighLow"] == "lowtoHigh" ? "blackBackground" : ""}`}></div></div><p>Price: Low to High</p></div>
                        </div>
                        <button onClick={() => {filter()}}>Apply</button>
                        </div>}
                    </div>
                    <div className='hotelsResult-starCateogory' onClick={() => {pop("starCategory") }}>
                    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16'></svg>
                    <p>Star category</p>&nbsp;&nbsp;
                    <svg width='14' height='14' fill='currentColor' className={`t-all ml-3 ${pop["starCategory"] ? "rotateButtonZero" : "rotateButtonOneNinty"}`} style={{color: "rgb(153, 153, 153)", transform: "rotate(-180deg)"}}></svg>
                    {pop["starCategory"] && <div className='hotelsResult-starCategory-pop' onClick={(e) => {e.stopPropagation();}}>
                    <h3>Star category</h3>
                    <div className='flex g10' onClick={() => {filterChanger("stars", "1")}}><div className='relativeColorInput'><div className={`absoluteColorDiv ${filter["stars"] == "1" ? "blackBackground" : ""}`}></div></div><p>1-star</p></div>
                    <div className='flex g10' onClick={() => {filterChanger("stars", "2")}}><div className='relativeColorInput'><div className={`absoluteColorDiv ${filter["stars"] == "2" ? "blackBackground" : ""}`}></div></div><p>2-star</p></div>
                    <div className='flex g10' onClick={() => {filterChanger("stars", "3")}}><div className='relativeColorInput'><div className={`absoluteColorDiv ${filter["stars"] == "3" ? "blackBackground" : ""}`}></div></div><p>3-star</p></div>
                    <div className='flex g10' onClick={() => {filterChanger("stars", "4")}}><div className='relativeColorInput'><div className={`absoluteColorDiv ${filter["stars"] == "4" ? "blackBackground" : ""}`}></div></div><p>4-star</p></div>
                    <div className='flex g10' onClick={() => {filterChanger("stars", "5")}}><div className='relativeColorInput'><div className={`absoluteColorDiv ${filter["stars"] == "5" ? "blackBackground" : ""}`}></div></div><p>5-star</p></div>
                    </div>}
                    </div>
                    <div className='hotelsResult-guestRating' onClick={() => pop("guestRating")}>
                    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16'></svg>
                    <p>Guest Ratings</p>&nbsp;&nbsp;
                    <svg width='14' height='14' fill='currentColor' className={`t-all ml-3 ${pop["guestRating"] ? "rotateButtonZero" : "rotateButtonOneNinty"}`} style={{color: "rgb(153, 153, 153)", transform: "rotate(-180deg)"}}></svg>
                    {pop["guestRating"] && <div className='hotelsResult-guestRating-pop' onClick={(e) => {e.stopPropagation();}}>
                    <h3>Guest Ratings</h3>
                    <div className='flex g10' onClick={() => {filterChangerforRating("rating", "5")}}><div className='relativeColorInput'><div className={`absoluteColorDiv ${filter["rating"] == "5" ? "blackBackground" : ""}`}></div></div><p>5</p></div>
                    <div className='flex g10' onClick={() => {filterChangerforRating("rating", "4.5")}}><div className='relativeColorInput'><div className={`absoluteColorDiv ${filter["rating"] == "4.5" ? "blackBackground" : ""}`}></div></div><p>4.5 & above</p></div>
                    <div className='flex g10' onClick={() => {filterChangerforRating("rating", "4")}}><div className='relativeColorInput'><div className={`absoluteColorDiv ${filter["rating"] == "4" ? "blackBackground" : ""}`}></div></div><p>4 & above</p></div>
                    <div className='flex g10' onClick={() => {filterChangerforRating("rating", "3.5")}}><div className='relativeColorInput'><div className={`absoluteColorDiv ${filter["rating"] == "3.5" ? "blackBackground" : ""}`}></div></div><p>3.5 & above</p></div>
                    <div className='flex g10' onClick={() => {filterChangerforRating("rating", "3")}}><div className='relativeColorInput'><div className={`absoluteColorDiv ${filter["rating"] == "3" ? "blackBackground" : ""}`}></div></div><p>3 & above</p></div>
                    <button onClick={() => {filter()}}>Apply</button>
                    </div>}
                    </div>
                    <div className='hotelsResult-price' onClick={() => {pop("price")}}>
                    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16'></svg>
                    <p>Price</p>
                    <pre>{filter["priceLow"]} {filter["priceHigh"]}</pre>&nbsp;&nbsp;
                    <svg width='14' height='9' fill='currentColor' className={`t-all ml-3 ${pop["guestRating"] ? "rotateButtonZero" : "rotateButtonOneNinty"}`} style={{color: "rgb(153, 153, 153)", transform: "rotate(-180deg)"}}></svg>
                    {pop["price"] && <div className='hotelResult-price-pop' onClick={(e) => {e.stopPropagation();}}>
                        <h3>Price (per night)</h3>
                        <div className='flex'><p>₹{filter["priceLow"].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p><p>₹{filter["priceHigh"].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p></div>
                        <MultiRangesSlider min={1000} max={10000} minValue={filter["priceLow"]} ruler="false" label="false" maxValue={filter["priceHigh"]} step={1} onInput={(e) => {minRangeSetter(e.minValue); maxRangeSetter(e.maxValue)}}/>
                        </div>}
                    </div>

                </div>
            </div>
        </nav>
        <div className='hotelResult-mainDivBody'>
            {loader && (data.length > 0 && (
                <div className='hotelsResult-renderGrid'>
                    {data.map((item, index) => (filter["priceHigh"] > item.avgCostPerNight && filter["priceLow"] < item.avgCostPerNight && (filter["stars"] != "" ? filter["stars"] == item.aminities.length : true) && (
                        <div key={index} className='hotelResult-card' onClick={() => {navigateCardInfo(item._id)}}>
                            <div className='img'><HotelResultCardCarousal data={item.images}/></div>
                            <div className='flex g10'>
                                <div className='flex g5'>
                                    <div className='hotelResultCard-firstLine'>
                                        <p>{item.name},&nbsp;{item.location}</p>
                                        <span><svg xmlns='http://www.w3.org/2000/svg' width='18' height='12' viewBox='0 0 18 12'></svg>{item.rating}/5</span>
                                    </div>
                                    <div className='hotelResultCard-secondLine'>
                                        <span>{item.aminities.length}- star hotel</span>
                                        <p>{item.room.length}K ratings</p>
                                    </div>
                                </div>
                                <div className='flex g5'>
                                    <div className='hotelResultCard-thirdLine'>
                                        <p className='flex'><h2>₹{item.avgCostPerNight && item.avgCostPerNight.toString().match(/^(\d+)\./) ? item.avgCostPerNight.toString().match(/^(\d+)\./)[1].replace(/\B(?=(\d{3})+(?!\d))/g, ',') : item.avgCostPerNight.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</h2>&nbsp; + ₹{((item.avgCostPerNight * 12)/100).toString().match(/^(\d+)(?=\.)/)[0]} tax / night</p>
                                    </div>
                                    <div className='hotelResultCard-fourthLine'>
                                        <span className='hotelResult-greenoffer'>52% OFF</span>
                                        <p> + Additional Bank Discounts</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )))}
                </div>
            ))}
            {!loader && <div className=''></div>}
            {loader && <div className='paginationDiv'>
                <button onClick={() => {setTimeout(() => {setPagination(pagination - 1)},500) }} className={pagination == 1? "disableColor" : ""} disabled={pagination == 1}>Prev</button>
                <p>{pagination} - page</p>
                <button onClick={() => {setTimeout(() => {setPagination(pagination + 1)},500) }} className={(+totalElementsForPagination/10) == pagination ? "disableColor" : ""} disabled={(+totalElementsForPagination/10) == pagination}>Next</button>
                </div>}
        </div>
        <Footer/>
     </>    
    )

}