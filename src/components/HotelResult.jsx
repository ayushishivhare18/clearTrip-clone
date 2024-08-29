import React, { useState, useEffect, useMemo, Children} from 'react';
import LoginSignup from '../smallComp/LoginSignup';
import { useNavigate, Link, NavLink, useLocation } from 'react-router-dom';
import "./HotelResult.css"
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
    let adults = JSON.parse(searchParams.get("adults"));
    console.log({children: searchParams.get("childrens")});
    let childrens = JSON.parse(searchParams.get("childrens"));
    let rooms = searchParams.get("rooms");
    const dateObject = new Date(daysOfWeek);

    const {filter, setFilter} = filterStatefun();
    const {all, setAll} = useAuthContext();
    const {details, setDetails} = detailsStatefun();
    const [tokenAvailibility, setTokenAvailibility] = useState();
    const [loginCheck, setLoginCheck] = useState(false)
    const [searchHotelData, setSearchHotelData] = useState([]);
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
    const [dataa, setDataa] = useState([]);
    const [loader, setLoader] = useState(false);
    const [totalElementsForPagination, setTotalElementsForPagination] = useState();
    const username = localStorage.getItem("username");
    function filterr(){
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
        navigate(`/hotels/result?location=${inputValue.match(/^([^,]+)/)[1]}&rooms=${details.rooms}&adults=${details.adults}&childrens=${details.childrens}&date=${dateGo}`)
    }

    function navigateCardInfo(hotel_id){
        if(localStorage.getItem("token")){
            navigate(`/hotels/results/hotelInfo?hotel_id=${hotel_id}&location=${cityParam}&rooms=${details.room}&adults=${details.adults}&childrens=${details.children}&date=${dateObject}`)
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
        if(filter.pricehighlow == ""){
            return value;
        }
        else if(filter.pricehighlow == "highToLow"){
            return value.sort((a,b) =>b.avgCostPerNight - a.avgCostPerNight);
        }
        else if (filter.pricehighlow == "lowToHigh"){
            return value.sort((a,b) =>a.avgCostPerNight - b.avgCostPerNight);
        }
    }

    //fetch hotel data
    const fetchMainDataHotels = useMemo(async ()=>{
        try{
            setLoader(false);
            
            const response = await (await fetch(`${baseAPI}/hotel?search={"location":"${cityParam}"}&sort={"avgCostPerNight":1}&filter={}&limit=10&page=${pagination}`,
            {
                method: "GET",
                headers: {
                    projectID: "ti65fq50h0gi",
                    "Content-Type": "application/json",
                }
            }
            )).json();
            setTotalElementsForPagination(response.totalResults);
            setDataa(sortingIncreaseOrDecrease(response.data.hotels));
            console.log(response.data);
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
    console.log('dataa:', dataa);
    console.log(username);

    return(
        <>
<div className='HotelsResult mainhotelresult flex flexc'>
{trueFinderPop() > 0 && <div className={`navbaranimatecloser  ${trueFinderPop() ? "animatedown" : "animateup"}`} onClick={() => { setNavAnimate({}) }}></div>}
{pop[`${Object.keys(pop)[0]}`] === true && <div className='filterpopcloser' onClick={() => { setPop({}) }}></div>}
<div className={`navbaranimate ${trueFinderPop() > 0 ? "animatedown" : "animateup"} flexja`}>
  <div className='upperCenterdivDynamic flexja b1 g5'>
    <div>
      <div className='hotelInputdynamic flexa g10' onClick={(e) => { closedDynamicPop("hotel") }} >
        
        <input className='inputdynamic' type='text' value={inputValue} onChange={(e) => { setInputValue(e.target.value); fetchDataHotelInputFields(e.target.value) }} />
        {navAnimate["hotel"] && <div className='popdynamichotelInput' onClick={(e) => { e.stopPropagation() }}>
          {Array.isArray(searchHotelData) && searchHotelData.map((item,index) => (
            <div key={index} className='hotelMainPageInput flexa' onClick={(e) => { e.stopPropagation(); setNavAnimate({ ["hotel"]: false }); setInputValue(item.location) }}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" className="dropdown-new__item-stroke--icon listItemHover"></svg>&nbsp;&nbsp;{item.location}</div>
          ))}
        </div>}
      </div>
      <div className='dateInputUpperdynamic flexa'>
        <div className='dateInputStaticInnerLeftdynamic flexja g5' onClick={() => { closedDynamicPop("goingdate") }}>
          
          <p>{`${dateGo.getDate()} ${dayGo}'${dateGo.getFullYear().toString().match(/\d{2}$/)[0]}`}</p>
          {navAnimate["goingdate"] && <Calendar minDate={new Date()} onChange={(date, e) => { e.stopPropagation(); setNavAnimate({ ["goingdate"]: false }); setDateGo(date); setDayGo(days[date.getDay()]); setMonthGo(months[date.getMonth()]) }} value={dateGo} className="calendarForGoing" />}
        </div>
        {/* <div className='datecenterline'></div> */}
        {/* <div className='dateInputStaticInnerRightdynamic flexja g5' onClick={() => { closedynamicpop("returndate") }} >
        <p>{`${datere.getDate()} ${dayre}'${datere.getFullYear().toString().match(/\d{2}$/)[0]}`}</p>
        {navanimate["returndate"] && <Calendar minDate={datego} onChange={(date, e) => { e.stopPropagation(); setnavanimate({ ["returndate"]: false }); setdatere(date); setdayre(days[date.getDay()]); setmonthre(months[date.getMonth()]) }} className="calendarForGoing" />}
      </div> */}
      </div>
      <div className='roomsAndGuestsdynamic flexja g5' onClick={() => { closedDynamicPop("room") }}>
        
        <p>{details["room"]} room, {details["adults"] + details["children"]} guests</p>
        {navAnimate["room"] && <div className='roomPopDynamic flexa flexc g20'>
          <div className='flexarg'>
            <div>
              <h4>Rooms</h4>
              <p>AC rooms</p>
            </div>
            <div className='buttondivguests flexa'>
              <button className={details["room"] == 1 ? "opacitydecrease" : ""} onClick={() => { guestsCalc("decrease", "room") }} disabled={details["room"] == 1}>-</button>
              <span>{details["room"]}</span>
              <button className={details["children"] + details["adults"] == details["room"] ? "opacitydecrease" : ""} onClick={() => { guestsCalc("increase", "room") }} disabled={details["children"] + details["adults"] == details["room"]}>+</button>
            </div>
          </div>
          <div className='flexarg'>
            <div>
              <h4>Adults over 12 Years</h4>
              <p>12+ years</p>
            </div>
            <div className='buttondivguests flexa'>
              <button className={details["adults"] == 1 ? "opacitydecrease" : ""} onClick={() => { guestsCalc("decrease", "adults") }} disabled={details["adults"] == 1}>-</button>
              <span>{details["adults"]}</span>
              <button onClick={() => { guestsCalc("increase", "adults") }}>+</button>
            </div>
          </div>
          <div className='flexarg'>
            <div>
              <h4>Children</h4>
              <p>1 - 11 years</p>
            </div>
            <div className='buttondivguests flexa'>
              <button className={details["children"] == 0 ? "opacitydecrease" : ""} onClick={() => { guestsCalc("decrease", "children") }} disabled={details["children"] == 0}>-</button>
              <span>{details["children"]}</span>
              <button onClick={() => { guestsCalc("increase", "children") }} disabled={details["children"] == details["adults"]}>+</button>
            </div>
          </div>
          <button className='guestsDoneButton' onClick={(e) => { e.stopPropagation(); setNavAnimate({ ["room"]: false }) }}>Done</button>
        </div>}
      </div>
    </div>
  </div>
  <button onClick={() => { setNavAnimate({}); navigateCurrentPage(); }}>Update</button>
</div>

{loginCheck && <LoginSignup settokenAvailability={setTokenAvailibility} checklogin={checkLogin} formClose={setLoginCheck} />}
<nav className='navFlightResults flexja'>
  <div className='innernav'>
    <div className='uppernav flexa'>
      <div className='upperLeftIcons flex'>
        <Link to="/"><svg width="107" height="24" viewBox="0 0 310 65" fill="none" ></svg></Link>
      </div>
      <div className='upperCenterdiv flexja g5'>
        <div className='hotelInputStatic flexa' onClick={() => { popUpNavAnimate("hotel") }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" className=""></svg>
          <p>{cityParam}</p>
        </div>
        <div className='dateInputUpperStatic flexa'>
          <div className='dateInputStaticInnerLeftStatic flexja g5' onClick={() => { popUpNavAnimate("goingdate") }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" className=""></svg>
            <p>{dateObject.getDate()} {days[dateObject.getDay()]}'{dateObject.getFullYear().toString().match(/\d{2}$/)[0]}</p>
          </div>
          {/* <div className='datecenterline'></div>
          <div className='dateInputStaticInnerRightStatic flexja g5' onClick={() => { popupnavanimate("returndate") }}>
            <p>{dateObject.getDate()} {days[dateObject.getDay()]}'{dateObject.getFullYear().toString().match(/\d{2}$/)[0]}</p>
          </div> */}
        </div>
        <div className='roomsAndGuestsStatic flexja g5' onClick={() => { popUpNavAnimate("room") }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" className=""></svg>
          <p>{rooms} room, {adults + childrens} guests</p>
        </div>

      </div>
      <div className='upperrightIcons flex'>

        <nav className='navUpperHome'>
          {!tokenAvailibility && <button className='loginoutBtn' onClick={() => setLoginCheck(true)}>Log in / Sign up</button>}
          {tokenAvailibility && <button className='profileBtn flexja' onClick={(e) => { setProfileToggle(!profileToggle) }} >
            {username && username}
            
            {profileToggle &&
              <div className='profilePop flexja flexc'>

                <div className='profileSelectorDiv flexja'>
                  <div className='profileSelectorleft'>
                    <h5>Account</h5>
                    <NavLink to="/bookeddetails"><p className='profileSelectors flexa'><p>Trips</p></p></NavLink>
                    <NavLink to="/under-maintainance"><p className='profileSelectors flexa'><p>ShortLists</p></p></NavLink>
                    <NavLink to="/under-maintainance"><p className='profileSelectors flexa'><p>Travellers</p></p></NavLink>
                    <NavLink to="/under-maintainance"><p className='profileSelectors flexa'><p>Cleartrip Wallet</p></p></NavLink>
                    <NavLink to="/under-maintainance"><p className='profileSelectors flexa'><p>Hi-Five</p></p></NavLink>
                    <NavLink to="/under-maintainance"><p className='profileSelectors flexa'><p>Expressway</p></p></NavLink>
                    <NavLink to="/under-maintainance"><p className='profileSelectors flexa'><p>Profile</p></p></NavLink>
                    <NavLink to="/under-maintainance"><p className='profileSelectors flexa'><p>Settings</p></p></NavLink>
                  </div>
                  <div className='profileSelectorright'>
                    <h5>Quick tools</h5>
                    <NavLink to="/under-maintainance"><p className='profileSelectors rightPS flexa'><p>Change flight</p></p></NavLink>
                    <NavLink to="/under-maintainance"><p className='profileSelectors rightPS flexa'><p>print ticket</p></p></NavLink>
                    <NavLink to="/under-maintainance"><p className='profileSelectors rightPS flexa'><p>print hotel voucher</p></p></NavLink>
                  </div>
                </div>
                <div className='SignoutBtn' onClick={() => { finishToken(); setAll((prev) => ({ ...prev, ["token"]: "" })) }}>Sign out</div>
              </div>}
          </button>}
        </nav>
      </div>
    </div>
    <div className='HotelsResultDownNav flexja'>
      <div className="hotelsresult-recommended flexa" onClick={() => { popp("highlow") }}>
        <p>Sort by: Recommended</p>
        &nbsp;&nbsp;<svg width="14" height="9" fill="currentColor" className={`t-all ml-3 ${pop["highlow"] ? "rotateButtonzero" : "rotateButtonOneNinty"}`} style={{ color: "rgb(153, 153, 153)", transform: "rotate(-180deg)" }}></svg>
        {pop["highlow"] && <div className='hotelsresult-recommended-pop flex flexc g20' onClick={(e) => { e.stopPropagation(); }}>
          <h3>Sort hotels by</h3>
          <div className='priceSort flex flexc g20'>
            <div className='flexa g5' onClick={() => { filterChanger("pricehighlow", "hightolow") }}><div className='relativecolorinput'><div className={`absolutecolordiv flexja ${filter["pricehighlow"] == "hightolow" ? "blackbackground" : ""}`}><div></div></div></div><p>Price: High to Low</p></div>
            <div className='flexa g5' onClick={() => { filterChanger("pricehighlow", "lowtohigh") }}><div className='relativecolorinput'><div className={`absolutecolordiv flexja ${filter["pricehighlow"] == "lowtohigh" ? "blackbackground" : ""}`}><div></div></div></div><p>Price: Low to High</p></div>
          </div>
          <button onClick={() => { filterr() }}>Apply</button>
        </div>}
      </div>
      <div className="hotelsresult-starCatagory flexa" onClick={() => { popp("starCatagory") }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"></svg>
        <p>Star category</p>
        &nbsp;&nbsp;<svg width="14" height="9" fill="currentColor" className={`t-all ml-3 ${pop["starCatagory"] ? "rotateButtonzero" : "rotateButtonOneNinty"}`} style={{ color: "rgb(153, 153, 153)", transform: "rotate(-180deg)" }}></svg>
        {pop["starCatagory"] && <div className='hotelsresult-starCatagory-pop flex flexc' onClick={(e) => { e.stopPropagation(); }}>
          <h3>Star category</h3>
          <div className='flexa g10' onClick={() => { filterChanger("stars", "1") }}><div className='relativecolorinput'><div className={`absolutecolordiv flexja ${filter["stars"] == "1" ? "blackbackground" : ""}`}><div></div></div></div><p>1-star hotels</p></div>
          <div className='flexa g10' onClick={() => { filterChanger("stars", "2") }}><div className='relativecolorinput'><div className={`absolutecolordiv flexja ${filter["stars"] == "2" ? "blackbackground" : ""}`}><div></div></div></div><p>2-star hotels</p></div>
          <div className='flexa g10' onClick={() => { filterChanger("stars", "3") }}><div className='relativecolorinput'><div className={`absolutecolordiv flexja ${filter["stars"] == "3" ? "blackbackground" : ""}`}><div></div></div></div><p>3-star hotels</p></div>
          <div className='flexa g10' onClick={() => { filterChanger("stars", "4") }}><div className='relativecolorinput'><div className={`absolutecolordiv flexja ${filter["stars"] == "4" ? "blackbackground" : ""}`}><div></div></div></div><p>4-star hotels</p></div>
          <div className='flexa g10' onClick={() => { filterChanger("stars", "5") }}><div className='relativecolorinput'><div className={`absolutecolordiv flexja ${filter["stars"] == "5" ? "blackbackground" : ""}`}><div></div></div></div><p>5-star hotels</p></div>
          <div className='flexa g10' onClick={() => { filterChanger("stars", "6") }}><div className='relativecolorinput'><div className={`absolutecolordiv flexja ${filter["stars"] == "6" ? "blackbackground" : ""}`}><div></div></div></div><p>6-star hotels</p></div>
        </div>}
      </div>
      <div className="hotelsresult-guestrating flexa" onClick={() => { popp("guestrating") }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"></svg>
        <p>Guest Ratings</p>
        &nbsp;&nbsp;<svg width="14" height="9" fill="currentColor" className={`t-all ml-3 ${pop["guestrating"] ? "rotateButtonzero" : "rotateButtonOneNinty"}`} style={{ color: "rgb(153, 153, 153)", transform: "rotate(-180deg)" }}></svg>
        {pop["guestrating"] && <div className='hotelsresult-guestrating-pop flex flexc' onClick={(e) => { e.stopPropagation(); }}>
          <h3>Guest Ratings</h3>
          <div className='flexa g10' onClick={() => { filterChangerForRating("rating", "4.5") }}><div className='relativecolorinput'><div className={`absolutecolordiv flexja ${filter["rating"] == "4.5" ? "blackbackground" : ""}`}><div></div></div></div><p>4.5 & above</p></div>
          <div className='flexa g10' onClick={() => { filterChangerForRating("rating", "4") }}><div className='relativecolorinput'><div className={`absolutecolordiv flexja ${filter["rating"] == "4" ? "blackbackground" : ""}`}><div></div></div></div><p>4 & above</p></div>
          <div className='flexa g10' onClick={() => { filterChangerForRating("rating", "3.5") }}><div className='relativecolorinput'><div className={`absolutecolordiv flexja ${filter["rating"] == "3.5" ? "blackbackground" : ""}`}><div></div></div></div><p>3.5 & above</p></div>
          <div className='flexa g10' onClick={() => { filterChangerForRating("rating", "3") }}><div className='relativecolorinput'><div className={`absolutecolordiv flexja ${filter["rating"] == "3" ? "blackbackground" : ""}`}><div></div></div></div><p>3 & above</p></div>
          <button onClick={() => { filterr() }}>Apply</button></div>}
      </div>
      <div className="hotelsresult-price flexa" onClick={() => { popp("price") }}>
        <svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg"></svg>
        <p>Price:</p>
        <pre>{filter["pricelow"]}    {filter["pricehigh"]}</pre>
        &nbsp;&nbsp;<svg width="14" height="9" fill="currentColor" className={`t-all ml-3 ${pop["price"] ? "rotateButtonzero" : "rotateButtonOneNinty"}`} style={{ color: "rgb(153, 153, 153)", transform: "rotate(-180deg)" }}></svg>
        {pop["price"] && <div className='hotelsresult-price-pop flex flexc g20' onClick={(e) => { e.stopPropagation(); }}>
          <h3>Price (per night)</h3>
          <div className='flexa'><p>₹{filter["pricelow"].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p><p>₹{filter["pricehigh"].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p></div>
          <MultiRangesSlider min={1000} max={10000} minValue={filter["pricelow"]} ruler="false" label="false" maxValue={filter["pricehigh"]} step={1} onInput={(e) => { minRangeSetter(e.minValue); maxRangeSetter(e.maxValue) }} />
        </div>}
      </div>
    </div>

  </div>
</nav>
<div className='hotelsresult-maindivbody flexa flexc '>
  {
    loader && (
        dataa &&
      dataa.length > 0 && (
        <div className='hotelsresult-rendergrid flexja flexc'>
          {dataa.map((item, index) => (filter["pricehigh"] > item.avgCostPerNight && filter["pricelow"] < item.avgCostPerNight && (filter["stars"] != "" ? filter["stars"] == item.amenities.length : true) && (
            <div key={index} className='hotelsresult-card' onClick={() => { navigateCardInfo(item._id) }}>
              <div className='img'><HotelResultCardCarousal data={item.images} /></div>
              <div className='flex flexc g10'>
                <div className='flexa23 flexc g5'>
                  <div className='flexa hotelsresultcard-firstline'>
                    <p>{item.name},&nbsp;{item.location}</p>
                    <span>{item.rating}/5</span>
                  </div>
                  <div className='hotelsresultcard-secondline flex'>
                    <span>{item.amenities.length}-star hotel</span>
                    <p>{item.rooms.length}K ratings</p>
                  </div>
        
                  <div className='hotelsresultcard-thirdline'>
                    <div className='bold'>₹{item.avgCostPerNight && item.avgCostPerNight.toString().match(/^(\d+)\./) ? item.avgCostPerNight.toString().match(/^(\d+)\./)[1].replace(/\B(?=(\d{3})+(?!\d))/g, ',') : item.avgCostPerNight.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>&nbsp; + ₹{((item.avgCostPerNight * 12) / 100).toString().match(/^(\d+)(?=\.)/)[0]} tax / night
                  </div>
                  <div className='flexa g5 hotelsresultcard-fourthline'>
                    <span className='hotelsresult-greenoffer'>52% off</span>
                    <p> + Additional bank discouts</p>
                  </div>
                </div>
              </div>
            </div>
          )))}
        </div>
      )
    )
  }
  {!loader && <div className="lds-dual-ring"></div>}
  {loader && <div className='flexa paginationbuttondiv'>
    <button onClick={() => { setTimeout(() => { setPagination(pagination - 1) }, 500) }} className={pagination == 1 ? "disabledcolor" : ""} disabled={pagination == 1}>Prev</button>
    <p className='flexja'>{pagination}-page</p>
    <button onClick={() => { setTimeout(() => { setPagination(pagination + 1) }, 500) }} className={(+totalElementsForPagination / 10) === pagination ? "disabledcolor" : ""} disabled={(+totalElementsForPagination / 10) === pagination}>Next</button>
  </div>}
</div>
<Footer />
</div>
</>    
    )

}
/*{//https://academics.newtonschool.co/api/v1/bookingportals/hotel?search={"location":"Indore, Madhya Pradesh"}
https://academics.newtonschool.co/api/v1/bookingportals/hotel?search=%7B%22location%22:%22Indore,+Madhya+Pradesh%22%7D&sort=%7B%22avgCostPerNight%22:1%7D&filter=%7B%7D&limit=10&page=1
}*/