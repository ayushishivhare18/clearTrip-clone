import React, { useState, useEffect, useMemo } from 'react';
import { NavLink, useNavigate, useLocation,Link } from 'react-router-dom';
import "./FlightResult.css"
import LoginSignup from '../smallComp/LoginSignup';
import { useAuthContext } from './ContextAllData';
import Calendar from 'react-calendar';
import MultiRangeSlider from 'multi-range-slider-react';
import {CiCircleInfo} from 'react-icons/ci'
import Footer from './Footer';
import { objDropDownCity, days, months, logofinder, airlineNamefinder, flightsresultsStatefun, baseAPI } from './Constants';

export default function FlightResult(){
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    let flightSource = searchParams.get("flightfrom");
    let flightDest = searchParams.get("flightto");
    let daysOfWeek = searchParams.get("daysofweek");
    const dateObject = new Date(daysOfWeek);

    const {filter, setFilter} = flightsresultsStatefun();
    const {all, setAll} = useAuthContext();
    const [toggleCardFullDetails, setToggleCardFullDetails] = useState({});
    const {rotateButton, setRotateButton} = flightsresultsStatefun();
    const {filterPopup, setFilterPopup} = flightsresultsStatefun();
    const [flightResultSortingNav, setFlightResultSortingNav] = useState({});
    const [pageLoader, setPageLoader] = useState(false);
    const [flightResultIn, setFlightResultIn] = useState({name:"", fname:""});
    const [flightResultOut, setFlightResultOut] = useState({name:"", fname:""});
    const [data, setData] = useState();
    const [loginCheck, setLoginCheck] = useState(false);
    const [profileToggle, setProfileToggle] = useState(false);
    const [value, setValue] = useState(2500);
    const [tokenAvailibility, setTokenAvailibility] = useState();
    const [ways, setWays] = useState("one");
    const [adult, SetAdult] = useState(1);
    const [children, setChildren] = useState(0);
    const [infant, setInfant] = useState(0);
    const [flightResultDateGo, setFlightResultDateGo] = useState(dateObject.getDate());
    const [flightResultDayGo, setFlightResultDayGo] = useState(days[dateObject.getDate()]);
    const [flightResultMonthGo, setFlightResultMontheGo] = useState(months[dateObject.getMonth()]);
    const [travellersCount, setTravellersCount] = useState(adult+ children+ infant);
    const [functionCallToggle, setFunctionCallToggle] = useState(false);
    const [calenderDate, setCalenderDate] = useState();
    const [oneWayPrice, setOneWayPrice] = useState("5,200");
    const [tripDurationMin, setTripDurationMin] = useState(1);
    const [tripDurationMax, setTripDurationMax] = useState(10);
    let count =0;
    

    //toggle flight option for filter
    function airlineSelector(key){
        setTimeout(() => {
            setFilter((prev) => ({...prev, [key]: !filter[key]}));
        },1000);
    }

    //toggle flights stops option for filter
    function airlineSelectorWithValue(key, value){
        setTimeout(() =>{
        if(filter[key] == value){
            setFilter((prev) => ({...prev, [key]: null}));
        }else{
            setFilter((prev) => ({...prev, [key]: value}));
        }
    },1000);
    }

    //flight More information popup
    function toggleCardDetails(val){
        setToggleCardFullDetails({})
        setToggleCardFullDetails( {[val]: !toggleCardFullDetails});
    }

    //swap flights
    function swapLocations(){
        const temp = flightResultIn;
        setFlightResultIn(flightResultOut);
        setFlightResultOut(temp);
    }

    //Sorting for flights
    function sortingNav(key){
        setFlightResultSortingNav({});
        setFlightResultSortingNav({ [key]: !flightResultSortingNav[key]});
    }

    //flight not available
    function message(){
        if(count == 0){
            return <div className='errorMessage'><div className='innerErrorMsg'><CiCircleInfo className='iconerrormsg'/>&nbsp;No flights found for this search</div></div>;
        }
    }

    //flight input value
    function locationSetter(){
        objDropDownCity.map((item) => (flightSource == item.name ? setFlightResultIn(prev => ({...prev, name: item.name, fname:item.fname})) : ""));
        objDropDownCity.map((item) => (flightDest == item.name ? setFlightResultOut(prev => ({...prev, name: item.name, fname:item.fname})) : ""));
    }

    //Debouncing for filters flight price
    const oneWayPriceWithComma = (number) =>{
        clearTimeout(tl);
        tl = setTimeout(() => {
            setValue(number);
        },3000);
        setOneWayPrice(number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
    };

    //price convert comma to int
    const oneWayPriceWithOutComma = ()=>{
        return parseInt(oneWayPrice.replace(/,/g, ''), 10);
    }

    //price convert int to comma
    function numberWithComma(num){
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    //rotate button wrt popup
    function buttonRotate(key){
        setRotateButton({});
        setRotateButton((prev)=> ({...prev, [key]: !rotateButton[key]}));
    }

    //popup filter hide & show
    function filterButtonRotate(key){
        setFilterPopup((prev) => ({...prev, [key]: !filterPopup[key]}));
    }

    //token availibility check
    function checkLogin(){
        const token = JSON.parse(localStorage.getItem("token")) || [];
        if(typeof token == "string"){
            setTokenAvailibility(true);
        }
    }
    useEffect(() =>{
        checkLogin();
    },[]);

    //popup adjustment menubar
    function buttonRotateAllFalse(){
        setRotateButton((prev) =>({prev:false}));
    }

    //while logout remove token
    function finishToken(){
        localStorage.removeItem("token");
        setTokenAvailibility(false);
        checkLogin();
    }

    //navigate to next page
    function navigateToFlightInfo(_id){
        if(localStorage.getItem("token")){
            navigate(`/flights/results/Info?flightid=${_id}&date=${dateObject}`);
        }
        else{
            setLoginCheck(true);
        }
    }

    //self navigate
    function forwardRoute(){
        navigate(`/flights/results?flightfrom=${flightResultIn.name}&flightto=${flightResultOut.name}&dayofweek=${calenderDate}`);
        setFunctionCallToggle(!functionCallToggle);
    }

    //token availibility checker
    function checkLogin(){
        const token = JSON.parse(localStorage.getItem("token")) || [];
        if(typeof token == "string"){
            setTokenAvailibility(true);
        }
    }
    useEffect(() =>{
        checkLogin();
    },[]);

    const abcd = checkLoginOrSignup=()=>{
        
        console.log("checkLoginOrSignup");
    }

    //fetch data main API
    const fetchDataForFlightsMountingPhase = useMemo(async ()=>{
        try{
            const response = await (await fetch(`${baseAPI}/flight?search={"source":"${flightSource}","destination":"${flightDest}"}&day=${days[dateObject.getDay()]}&filter={${filter.stops != null ? `"stops":${filter.stops},` : ""}${`"ticketPrice":{"$lte":${value}}`},"duration":{"$lte":${tripDurationMax},"$gte":${tripDurationMin}}}&limit=800&page=1&sort={${Object.keys(flightResultSortingNav).length === 0 ? "" : `"${Object.keys(flightResultSortingNav)[0]}":${flightResultSortingNav[`${Object.keys(flightResultSortingNav)[0]}`] == true ? "1" : "-1"}`}}`,
               {
                method: "GET",
                headers: {
                    projectID: "ti65fq50h0gi",
                    "Content-Type": "application/json",
                }
               }
            )).json();
            setData(response.data.flights);
            setPageLoader(true);
            locationSetter();
        }catch(error){
            alert(error);
        }

    },[functionCallToggle, value, filter, flightResultSortingNav, tripDurationMax, tripDurationMin]);
    useEffect(() =>{
        setPageLoader(false);
        fetchDataForFlightsMountingPhase;
        setCalenderDate(dateObject);
    },[]);

    return(
        <div className='flightResultMain'>
            {loginCheck && <LoginSignup setTokenAvailibility={setTokenAvailibility} checkLogin={checkLogin} formClose={setLoginCheck}/>}
            <nav className='navFlightResult'>
                <div className='innerNav'>
                    <div>
                        <div className='upperNav'>
                            <div className='upperLeftIcons'>
                                <Link to="/"><svg width="107" height="24" viewBox="0 0 310 65" fill="none" ><path  fill="#FF4F17"></path></svg></Link>
                                <Link to="/flights"><svg height="18px" width="18px" fill="#999"><title>Flights</title><path  fill="#36C" fillRule="evenodd"></path></svg></Link>
                                <Link to="/hotels"><svg width="20" height="20" fill="#999"><title>Hotels</title><g fill="none" fillRule="evenodd"><path fill="#FFF"></path><path fill="#36CD"></path></g></svg></Link>
                            </div>
                            <div className='upperRightIcons'>
                                <nav className='navUpperHome'>
                                    {!tokenAvailibility && <button className='loginOutButton' onClick={checkLoginOrSignup}>Log in/Sign up</button>}
                                    {tokenAvailibility && <button className='profileButton' onClick={(e) => {setProfileToggle(!profileToggle)}}>
                                        <svg viewBox="0 0 14 14" height="16px" width="16px" className="c-inherit"><g fill="none" fillRule='evenodd'><react width="14" height="14" fill="#FFF" opacity="0"></react> <circle cx="7" cy="7" r="6.25" stroke="currentColor" strokeWidth="1.5"></circle><path fill="currentColor" transform="matrix(-1 0 0 1 10 3)"></path><path fill="currentColor" ></path><circle cx="7" cy="7" r="7.75" stroke="#FFF" strokeWidth="1.5"></circle></g></svg>
                                        {JSON.parse(localStorage.getItem("username"))}
                                        {profileToggle &&  
                                        <div className='profilepop'>
                                            <div className='profileSelectorDiv'>
                                                <div className='profileSelectorLeft'>
                                                    <h5>Account</h5>
                                                    <NavLink to="/bookeddetails"><p className='profileSelectors flexa'><svg viewBox="0 0 14 14" height="16" width="16" className="c-neutral-400"><g fill="none" fillRule="evenodd"><rect width="14" height="14" fill="#FFF" opacity="0"></rect><path fill="currentColor"></path></g></svg><p>Travellers</p></p></NavLink>
                                                    <NavLink to="/under-maintainance"><p className='profileSelectors flexa'><svg viewBox="0 0 14 14" height="16" width="16" className="c-neutral-400"><g fill="none" fillRule="evenodd"><rect width="14" height="14" fill="#FFF" opacity="0"></rect><path fill="currentColor" ></path></g></svg><p>Cleartrip Wallet</p></p></NavLink>
                                                    <NavLink to="/under-maintainance"><p className='profileSelectors flexa'><svg width="16" height="16" viewBox="0 0 14 14" fill="none" className="c-neutral-400"><path  fill="#808080" fill-opacity="0.7"></path><path stroke="#D1D1D1" strokeWidth="0.4" strokeLinecap="round" strokeLinejoin="round"></path><path stroke="#B3B3B3" strokeWidth="0.545068" strokeLinecap="round" strokeLinejoin="round"></path></svg> <p>Hi-Five</p></p></NavLink>
                                                    <NavLink to="/under-maintainance"><p className='profileSelectors flexa'><svg viewBox="0 0 14 14" height="16" width="16" className="c-neutral-400"><g fill="none" fillRule="evenodd"><rect width="14" height="14" fill="#FFF" opacity="0"></rect><path fill="currentColor" fillRule="nonzero" ></path></g></svg><p>Expressway</p></p></NavLink>
                                                    <NavLink to="/under-maintainance"><p className='profileSelectors flexa'><svg viewBox="0 0 103 94" height="16" width="16" fill="#999" className=""><path fillRule="evenodd" ></path></svg><p>Profile</p></p></NavLink>
                                                    <NavLink to="/under-maintainance"><p className='profileSelectors flexa'><svg viewBox="0 0 14 14" height="16" width="16" className="c-neutral-400"><g fill="none" fillRule="evenodd"><rect width="14" height="14" fill="#FFF" opacity="0"></rect><g transform="translate(-.5)"><path stroke="currentColor" strokeWidth="2" ></path><g fill="currentColor" transform="translate(6)"><polygon points=".5 11 2.5 11 2.5 14 .5 14"></polygon><polygon points=".5 0 2.5 0 2.5 3 .5 3"></polygon></g><g fill="currentColor" transform="rotate(-45 4.5 -.243)"><polygon points=".5 11 2.5 11 2.5 14 .5 14"></polygon><polygon points=".5 0 2.5 0 2.5 3 .5 3"></polygon></g><g fill="currentColor" transform="rotate(45 4.5 14.243)"><polygon points=".5 11 2.5 11 2.5 14 .5 14"></polygon><polygon points=".5 0 2.5 0 2.5 3 .5 3"></polygon></g><g fill="currentColor" transform="rotate(90 4.5 10)"><polygon points=".5 11 2.5 11 2.5 14 .5 14"></polygon><polygon points=".5 0 2.5 0 2.5 3 .5 3"></polygon></g></g></g></svg><p>Settings</p></p></NavLink>
                                                </div>
                                                <div className='profileSelectorRight'>
                                                    <h5>Quick tools</h5>
                                                    <NavLink to="/under-maintainance"><p className='profileSelectors rightPS flexa'><svg viewBox="0 0 14 14" className="c-secondary-500" height="16" width="16"><g fill="none" fillRule="evenodd"><rect width="14" height="14" fill="#FFF" opacity="0"></rect><path fill="currentColor" fillRule="nonzero"></path></g></svg><p>Cancellations</p></p></NavLink>
                                                    <NavLink to="/under-maintainance"><p className='profileSelectors rightPS flexa'><svg viewBox="0 0 14 14" className="c-secondary-500" height="16" width="16"><g fill="none" fillRule="evenodd"><rect width="14" height="14" fill="#FFF" opacity="0"></rect><path fill="currentColor" fillRule="nonzero"></path></g></svg><p>Change flight</p></p></NavLink>
                                                    <NavLink to="/under-maintainance"><p className='profileSelectors rightPS flexa'><svg viewBox="0 0 14 14" height="16" width="16" className="c-secondary-500"><g fill="none" fillRule="evenodd"><rect width="14" height="14" fill="#FFF" opacity="0"></rect><path fill="currentColor" fillRule="nonzero"></path></g></svg><p>print ticket</p></p></NavLink>
                                                    <NavLink to="/under-maintainance"><p className='profileSelectors rightPS flexa'><svg viewBox="0 0 14 14" height="16" width="16" className="c-secondary-500"><g fill="none" fillRule="evenodd"><rect width="14" height="14" fill="#FFF" opacity="0"></rect><path fill="currentColor" fillRule="nonzero"></path></g></svg><p>print hotel voucher</p></p></NavLink>
                                                </div>
                                            </div>
                                            <div className='signOutButton' onClick={() => {finishToken(); setAll((prev) => ({...prev, ["token"]: ""}))}}>Sign out</div>
                                        </div>
                                        }
                                        </button>}
                                </nav>
                            </div>
                        </div>
                        <div className='downNav flex g20'>
                            <div className='flex g5'>
                                <div className='flightResultWays' onClick={() =>{ buttonRotate("ways");}}>
                                    <p>{ways == "one" ? "One way" : "Round trip"}</p>
                                    <svg width="14" height="9" fill='currentColor' className={`t-all ml-3 ${rotateButton["ways"] ? "rotateButtonZero" : "rotateButtonOneNinty"}`} style={{color: "rgb(153,153,153)", transform: "rotate(-180deg)"}}><g fill='none' fillRule='evenodd'><path stroke='#FFF' strokeWidth="0.5" fill='currentColor'></path> </g></svg>
                                    {rotateButton["ways"] && <div className='flightResultWaysPop'>
                                        <p onClick={() => {setWays("one");}}>
                                            {ways == "one" && <svg width="24" height="24" viewBox='0 0 24 24' fill='none' ></svg>}
                                            <p className='wayChooserPtext'>&nbsp;&nbsp; One Way</p>
                                        </p>
                                        <p onClick={() => {setWays("two");}}>
                                            {ways == "two" && <svg width="24" height="24" viewBox='0 0 24 24' fill='none' ></svg>}
                                            <p className='wayChooserPtext'>&nbsp;&nbsp; Round trip</p>
                                        </p>
                                        </div>}
                                </div>
                                <div className='flightResultInOut'>
                                    <input className='flightResultIn' value={`${flightResultIn.name}-${flightResultIn.fname}`} onClick={() =>{buttonRotate("flightIn");}}/>
                                    {rotateButton["flightIn"] && <div className='flightInData flightResultInData'>
                                        {objDropDownCity.map((item) =>{
                                            <div className='slide' onClick={() => {setFlightResultIn(prev =>({...prev, name: item.name, fname: item.fname})); buttonRotateAllFalse()}}>
                                                <p>{item.name}</p>
                                                <p>{item.fname} {item.lname}</p>
                                            </div>
                                        })}
                                        </div>}
                                        <svg onClick={() =>{swapLocations(); buttonRotateAllFalse()}} width='16' height='14' data-testid='modify-swap' className='c-pointer'></svg>
                                        <input className='flightResultOut' value={`${flightResultOut.name}-${flightResultOut.fname}`} onClick={() => {buttonRotate("flightOut");}}/>
                                        {rotateButton["flightOut"] && <div className='flightInData flightResultOutData'>
                                        {objDropDownCity.map((item) =>{
                                            <div className='slide' onClick={() => {setFlightResultOut(prev =>({...prev, name: item.name, fname: item.fname})); buttonRotateAllFalse()}}>
                                                <p>{item.name}</p>
                                                <p>{item.fname} {item.lname}</p>
                                            </div>
                                        })}
                                        </div>   
                                            }
                                </div>
                            </div>
                            <div>
                                <div className='flightResultLeftDatePicker' onClick={() => {buttonRotate("datego")}}> 
                                    <div className='datesGoing flightResultDatesGoing'>
                                        {`${flightResultDayGo}, ${flightResultMonthGo}, ${flightResultDateGo}`}
                                    </div>
                                    {rotateButton["datego"] && <Calendar minDate={new Date()} onChange={(date) => {setFlightResultDateGo(date.getDate()); setCalenderDate(date); setFlightResultDayGo(days[date.getDay()]); setFlightResultMontheGo(months[date.getMonth()]);}} value={flightResultDateGo} className='calenderForGoing flightResultCalenderGoing'/>}
                                </div>
                                <div className='flightResultTraveller'>
                                    <div className='travellerData' onClick={() => {buttonRotate("traveller")}}>{`${travellersCount} Travellers`}</div>
                                    <svg onClick={() => {buttonRotate("traveller")}} width='14' height='9' fill='currentColor' className={`t-all ml-3 ${rotateButton["traveller"] ? "rotateButtonzero" : "rotateButtonOneNinty"}`} style={{color: "rgb(153, 153, 153)", transform: "rotate(-180deg)"}}></svg>
                                    {rotateButton["traveller"] &&
                                    <div className='peopleChooser flightResultPeopleChooser'>
                                        <div className='adultsflex'>
                                            <div>
                                                <h3>Adults</h3>
                                                <h5>(12+ years)</h5>
                                            </div>
                                            <div className='peopleCounter'>
                                                <button className='flex min' onClick={()=> SetAdult(adult -1)} disabled={adult == 1}>-</button>
                                                <h4>{adult}</h4>
                                                <button className='flex max' onClick={()=> SetAdult(adult+1)}>+</button>
                                            </div>
                                        </div>
                                        <div className='children'>
                                            <div>
                                                <h3>Children</h3>
                                                <h5>(2 - 12 yrs)</h5>
                                            </div>
                                            <div className='peopleCounter'>
                                                <button className='flex min' onClick={() => setChildren(children-1)} disabled={children == 0}>-</button>
                                                <h4>{children}</h4>
                                                <button className='flex max' onClick={()=> setChildren(children+1)}>+</button>
                                            </div>
                                        </div>
                                        <div className='infants'>
                                            <div>
                                                <h3>Infants</h3>
                                                <h5>(Below 2 yrs)</h5>
                                            </div>
                                            <div className='peopleCounter'>
                                                <button className='flex min' onClick={() => setInfant(infant-1)} disabled={infant == 0}>-</button>
                                                <h4>{infant}</h4>
                                                <button className='flex max' onClick={()=> setInfant(infant+1)}>+</button>
                                            </div>
                                        </div>
                                        <button onClick={() => {setTravellersCount(adult + children + infant); buttonRotateAllFalse()}}>Submit</button>
                                    </div>
                                    }
                                </div>
                                <button className='flightResultSubmitMain' onClick={() => {buttonRotate("submit");forwardRoute();}}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            
            {pageLoader &&
            <div className='mainPageFlightResult'>
                <div className='leftSortingComponent'>
                    <div className='stops flex' onClick={() => {filterButtonRotate("stops")}}>
                        <p>Stops</p>
                        <svg width='14' height='9' fill='currentColor' className={`t-all ml-3 ${filterPopup["stops"] ? "rotateButtonZero" : "rotateButtonOneNinty"}`} style={{color: "rgb(153, 153, 153)", transform: "rotate(-180deg)"}}><g fill='none' fillRule='evenodd'></g></svg>
                    </div>
                    {filterPopup["stops"] && 
                    <div className='filterPopUpStops'>
                        <label onClick={() => {airlineSelectorWithValue("stops", 0)}} for="non-stop" className='flex'><div> <input type='checkbox' id='non-stop' checked={filter["stops"]==0}/><p>Non-stop</p></div></label>
                        <label onClick={() => {airlineSelectorWithValue("stops", 1)}} for="1-stop" className='flex'><div> <input type='checkbox' id='1-stop' checked={filter["stops"]==1}/><p>1 stop</p></div></label>
                        <label onClick={() => {airlineSelectorWithValue("stops", 2)}} for="2-stop" className='flex'><div> <input type='checkbox' id='2-stop' checked={filter["stops"]==2}/><p>2 stop</p></div></label>
                    </div>
                    }
                    <div className='wayPrice' onClick={() => {filterButtonRotate("wayprice")}}>
                        <p>One-way price</p>
                        <svg width='18' height='9' fill='currentColor' className={`t-all ml-3 ${filterPopup["wayprice"] ? "rotateButtonZero" : "rotateButtonOneNinty"}`} style={{color: "rgb(153, 153, 153)", transform: "rotate(-180deg)"}}></svg>
                    </div>
                    {filterPopup["wayprice"] &&
                    <div className='filterPopUpWayPrice'>
                        <p>Up to ₹{oneWayPrice}</p>
                        <input type='range' min='5091' max='13217' value={oneWayPriceWithOutComma()} onChange={() =>{oneWayPriceWithComma(e.target.value);}}/>
                        <div><p>5,091</p><p>13,217</p></div>
                    </div>
                    }
                    <div className='airline' onClick={() => {filterButtonRotate("airline")}}>
                        <p>Airlines</p>
                        <svg width='14' height='9' fill='currentColor' className={`t-all ml-3 ${filterPopup["airline"] ? "rotateButtonZero" : "rotateButtonOneNinty"}`} style={{color: "rgb(153, 153, 153)", transform: "rotate(-180deg)"}}><g fill='none' fillRule='evenodd'></g></svg>
                    </div>
                    {filterPopup["airline"] && 
                    <div className='filterPopUpAirline'>
                        <label onClick={() => {airlineSelector("AI")}} for="Air-India"><div className='flex'><input type='checkbox' id='Air-india' checked={filter["AI"]}/><p>Air India</p></div>₹10,688</label>
                        <label onClick={() => {airlineSelector("I5")}} for="Air-India-express"><div className='flex'><input type='checkbox' id='Air-India-express' checked={filter["I5"]}/><p>Air India Express</p></div>₹12,668</label>
                        <label onClick={() => {airlineSelector("QP")}} for="Akasa-air"><div className='flex'><input type='checkbox' id='Akasa-air' checked={filter["QP"]}/><p>Akasa Air</p></div>₹14,285</label>
                        <label onClick={() => {airlineSelector("6E")}} for="Indigo"><div className='flex'><input type='checkbox' id='Indigo' checked={filter["6E"]}/><p>IndiGo</p></div>₹7,568</label>
                        <label onClick={() => {airlineSelector("SG")}} for="Spicejet"><div className='flex'><input type='checkbox' id='Spicejet' checked={filter["SG"]}/><p>SpiceJet</p></div>₹13,678</label>
                        <label onClick={() => {airlineSelector("UK")}} for="Vistara"><div className='flex'><input type='checkbox' id='Vistara' checked={filter["UK"]}/><p>Vistara</p></div>₹15,689</label>
                        <label onClick={() => {airlineSelector("S5")}} for="Star-air"><div className='flex'><input type='checkbox' id='Star-air' checked={filter["S5"]}/><p>Star Air</p></div>₹17,288</label>
                    </div>
                    }
                    <div className='duration' onClick={() => {filterButtonRotate("duration")}}>
                        <p>Trip duration</p>
                        <svg width='14' height='9' fill='currentColor' className={`t-all ml-3 ${filterPopup["duration"] ? "rotateButtonZero" : "rotateButtonOneNinty"}`} style={{color: "rgb(153, 153, 153)", transform: "rotate(-180deg)"}}><g fill='none' fillRule='evenodd'></g></svg>
                    </div>
                    {filterPopup["duration"] &&
                    <div className='filterPopUpDuration'>
                        <div><p>{tripDurationMin} hours</p><p>{tripDurationMax} hours</p></div>
                        <MultiRangeSlider min={1} max={10} minValue={tripDurationMin} ruler='fale' label='false' maxValue={tripDurationMax} step={1} onInput={(e) => {setTripDurationMin(e.minValue); setTripDurationMax(e.maxValue);}} className='multiRangeLayOver'/>
                    </div>
                    }
                </div>
                <div className='flightResultDataRender'>
                    <nav className='flightResultSortingNav'>
                        <div>Airlines</div>
                        <div className={flightResultSortingNav["departureTime"] ? "activeSortingNavColor" : flightResultSortingNav["departureTime"] == false ? "activeSortingNavColor" : null} onClick={() => {sortingNav("departureTime")}}>Departure &nbsp;{(flightResultSortingNav["departureTime"] == false && <svg viewBox='0 0 5 8' fill='currentColor' width='7px' height='12px' style={{transform: `rotate(${-180}deg)`}}></svg>)}{(flightResultSortingNav["departureTime"] == true && <svg viewBox='0 0 5 8' fill='currentColor' width='7px' height='12px'></svg>)} </div>
                        <div className={flightResultSortingNav["duration"] ? "activeSortingNavColor" : flightResultSortingNav["duration"] == false ? "activeSortingNavColor" : null} onClick={() => {sortingNav("duration")}}>Duration &nbsp;{(flightResultSortingNav["duration"] == false && <svg viewBox='0 0 5 8' fill='currentColor' width='7px' height='12px' style={{transform: `rotate(${-180}deg)`}}></svg>)}{(flightResultSortingNav["departureTime"] == true && <svg viewBox='0 0 5 8' fill='currentColor' width='7px' height='12px'></svg>)} </div>
                        <div className={flightResultSortingNav["arrivalTime"] ? "activeSortingNavColor" : flightResultSortingNav["arrivalTime"] == false ? "activeSortingNavColor" : null} onClick={() => {sortingNav("arrivalTime")}}>Arrival &nbsp;{(flightResultSortingNav["arrivalTime"] == false && <svg viewBox='0 0 5 8' fill='currentColor' width='7px' height='12px' style={{transform: `rotate(${-180}deg)`}}></svg>)}{(flightResultSortingNav["departureTime"] == true && <svg viewBox='0 0 5 8' fill='currentColor' width='7px' height='12px'></svg>)} </div>
                        <div className={flightResultSortingNav["ticketPrice"] ? "activeSortingNavColor" : flightResultSortingNav["ticketPrice"] == false ? "activeSortingNavColor" : null} onClick={() => {sortingNav("ticketPrice")}}>Price &nbsp;{(flightResultSortingNav["ticketPrice"] == false && <svg viewBox='0 0 5 8' fill='currentColor' width='7px' height='12px' style={{transform: `rotate(${-180}deg)`}}></svg>)}{(flightResultSortingNav["departureTime"] == true && <svg viewBox='0 0 5 8' fill='currentColor' width='7px' height='12px'></svg>)} </div>
                        <div style={{width:"100px"}}></div>
                    </nav>

                    <div className='flightResultData'>
                        {data.map((item, index) => (filter[`${item.flightID[0]}${item.flightID[1]}`] && <div className='countVisibility'>{count++}</div> && (
                            <div className='flightResultCardOuter'>
                                <div className='flightResultCardInner'>
                                    <div className='flightResultCardHeader'>
                                        <div className='flex g10'>
                                            <img src={logofinder(item)}/>
                                            <div>
                                                <p className='flightName'>{airlineNamefinder(item)}</p>
                                                <p className='flightID'>{`${item.flightID[0]}${item.flightID[1]}-${item.flightID[item.flightID.length - 3] + item.flightID[item.flightID.length-2] + item.flightID[item.flightID.length-1]}`}</p>
                                            </div>
                                        </div>
                                        <div className='flightDetails' onClick={() => {toggleCardDetails(`${index}`)}}>
                                            {toggleCardFullDetails[`${index}`] ? "Hide Details" : "Flight Details"}
                                        </div>
                                    </div>
                                    <div className='flightResultDepartureTime'>{item.departureTime}</div>
                                    <div className='flightResultDuration'><p className='flightresultduration'>{item.duration}h 00m</p><div className='flightDurationAndStopSeprator'></div><p className='flightResultStops'>{item.stops == 0 ? "non-stop" : item.stops == 1 ? item.stops + "stop" : item.stops + "stops"}</p></div>
                                    <div className='flightResultArrivalTime'>{item.arrivalTime}</div>
                                    <div className='flightPrice'>₹{numberWithComma(item.ticketPrice)}</div>
                                    <div className='flightBookButton' onClick={() => {navigateToFlightInfo(item._id)}}>Book</div>
                                </div>
                                {toggleCardFullDetails[`${index}`] &&
                                <div className='flightResultCardFullDetails'>
                                    <div className='flightResultCardFullDetailsHeader'>
                                        <div className='flex g20'>
                                            {objDropDownCity.map((item) => (item.name == item.source ? `${item.fname.match(/^([^,]+)/)[1]}` : ""))} → {objDropDownCity.map((item) => (item.name == item.destination ? `${item.fname.match(/^([^,]+)/)[1]}` : ""))}
                                        </div>
                                        <div className='cardMentionDate'>
                                            {days[dateObject.getDay()]}, {dateObject.getDate()} {months[dateObject.getMonth()]}
                                        </div>
                                    </div>
                                    <div className='flightResult-cardInnerDetails'>
                                        <div className='phase1'>
                                            <img src={logofinder(item)} alt='image'/>
                                            <p>{airlineNamefinder(item)}</p>
                                            <p className='flightId'>{`${item.flightID[0]}${item.flightID[1]}-${item.flightID[item.flightID.length-3] + item.flightID[item.flightID.length-2] + item.flightID[item.flightID.length-1]}`}</p>
                                        </div>
                                        <div className='phase2'>
                                            <h2><span>{item.source}</span> {item.departureTime}</h2>
                                            <p>{days[dateObject.getDay()]}, {dateObject.getDate()} {months[dateObject.getMonth()]} {dateObject.getFullYear()}</p>
                                        </div>
                                        <div className='phase3'>
                                            <svg width='20' height='20'><g fill='#4D4D4D' fillRule='evenodd'></g></svg>
                                            <p>{item.duration}h 00m</p>
                                        </div>
                                        <div className='phase4'>
                                            <h2><span>{item.destination}</span> {item.arrivalTime}</h2>
                                            <p>{days[dateObject.getDay()]}, {dateObject.getDate()} {months[dateObject.getMonth()]} {dateObject.getFullYear()}</p>
                                        </div>
                                        <div className='phase5'>
                                            <p>Check-in baggage</p>
                                            <p>Cabin baggage</p>
                                        </div>
                                    </div>
                                </div>
                                }
                            </div>
                        )))}
                        {message()}
                    </div>
                </div>
            </div>
            }
            {!pageLoader && <div></div>}
            <Footer/>
        </div>
    )
}