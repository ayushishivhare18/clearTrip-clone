import React, { useState, useEffect, useRef } from 'react';
import './FlightInfo.css';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { IoIosArrowDown } from 'react-icons/io';
import Footer from './Footer';
import { countries, states, months, days, objDropDownState, logofinder, airlineNamefinder, detailsStatefun, baseAPI, logosvg, localTokens } from './Constants';
import { MdOutlineWatchLater } from "react-icons/md";

export default function FlightInfo() {
    const navigate = useNavigate();
    const inputRef = useRef();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    let flightid = searchParams.get('flightid');
    let daysOfWeek = searchParams.get('date');
    const dateObject = new Date(daysOfWeek);
    const {details, setdetails } = detailsStatefun();
    const [pageLoader, setPageLoader] = useState(false);
    const [dataa, setDataa]  = useState();
    const [date, setDate] = useState(dateObject.getDate());
    const [day, setDay] = useState(days[dateObject.getDay()]);
    const [month, setMonth] = useState(months[dateObject.getMonth]);
    const [year, setYear] = useState(dateObject.getFullYear());
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [errorContact, setErrorContact] = useState(false);
    const [pop, setPop] = useState({});
    const [switcherForm, setSwitcherForm] = useState(false);

    //toggle for popups
    function popp(key){
        setPop({});
        setPop((prev)=> ({ ...prev, [key]: !pop[key]}));
    }

    //Departure date maker for post data
    function startDate(){
        const departureDate = new Date(dateObject);
        const [hours, minutes] = dataa.departureTime.split(':');
        departureDate.setHours(hours, minutes);
        return departureDate;
    }

    //Arrival date maker for post data
    function endDate(){
        const [departureHour, departureMinute] = dataa.departureTime.split(':');
        const [arrivalHour, arrivalMinute] = dataa.arrivalTime.split(':');
        const arrivalDate = new Date (dateObject);
        if (departureHour > arrivalHour){
            arrivalDate.setHours(arrivalHour, arrivalMinute);
        }
        else if (departureHour == arrivalHour){
            arrivalDate.setHours(arrivalHour, departureMinute + arrivalMinute);
        } 
        else{
            arrivalDate.setHours(departureHour + arrivalHour, departureMinute + arrivalMinute);
        }
        return arrivalDate;
    }

    //Error handling phone number and emails to push next steps
    function personalInfosender(e){
        e.preventDefault();
        if(phoneNumber.length == 10 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
            setdetails((prev) => ({...prev, dnumber: phoneNumber, demail: email}));
            setSwitcherForm(true);
            setPhoneNumber('');
            setEmail('');
        }else{
            setErrorContact(true);
        }
    }
    
    //user details setter
    function travellerInfo(key, value){
        setdetails((prev) => ({...prev, [key]: value}));
    }

    //Flight booking data
    const sendData = async ()=>{
        try{
            if(
                details.dnumber && details.demail && details.dfname && details.dlname && details.dgender && details.dcountry && details.dstate && details.dbillingAddress
            ){
                const response = await fetch(`${baseAPI}/booking`,{
                    method: 'POST',
                    headers: {
                        projectID: 'ti65fq50h0gi',
                        Authorization: `Bearer ${localTokens}`,
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        bookingType: 'flight',
                        bookingDetails: {
                            flightID: `${flightid}`,
                            startDate: `${startDate()}`,
                            endData: `${endDate()}`,
                        },
                    }),
                });
                console.log(flightid);
                console.log(startDate());
                console.log(endDate());
            }
        }catch(error){
            alert(error);
        }
    };

    //Redirect to next page
    function gotoPayment() {
        if(
            details.dnumber && details.demail && details.dfname && details.dlname && details.dgender && details.dcountry && details.dstate 
        ){
            navigate(
                `/flights/results/flightInfo/flightbooking?FirstName="${details.dfname}"&Email="${details.demail}"&amount=${CalculateTotalAmount()}`
            );
        }else{
            alert('details are not fully filled, fill all the fileds')
        }
    }

    //Error handling of email
    function emailError(e){
        const inputVal = e.target.val;
        const inputEle = e.target;
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputVal)){
            inputEle.style.outline = "1 px solid green";
        } else {
            inputEle.style.outline = "none";
        }
    }

    //To calculate tax for rendering
    function taxCalculate(){
        const val = (dataa.ticketPrice * 18)/100;
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    //To calculate amount for rendering
    function CalculateTotalAmount(){
        const val = (dataa.ticketPrice * 18)/100;
        const add = val + dataa.ticketPrice;
        return Math.floor(add).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    //To handle mobile number error
    function numberError(e){
        const inputValue = e.target.value;
        const inputElement = e.target;
        if(inputValue.length == 0){
            inputElement.style.outline = "none";
        }else if(inputValue.length == 10){
            inputElement.style.outline = "1px solid green";
        }else{
            inputElement.style.outline = "1px solid red";
        }
    }

    //Function to fetch flight data(Main function)
     async function fetchDataForFlightCardDetails(){
        try{
            const response = await(
                await fetch(`${baseAPI}/flight/${flightid}`,{
                    method: "GET",
                    headers: {
                        projectID: "ti65fq50h0gi",
                        "Content-Type": "application/json",
                    },
                })
            ).json();
            setDataa(response.data);
            setPageLoader(true);
        }catch(error){
            alert(error);
        }
     }
     useEffect (() =>{
        setPageLoader(false);
        fetchDataForFlightCardDetails();
     },[]);

     return(
       <div className='flightInfo flex'>
        <div className='wholeNav flex'>
            <nav className='flex'>
                <NavLink to='/'>
                    {logosvg}
                </NavLink>
            </nav>
        </div>
        {pageLoader && dataa &&
        <div className='flightInfoBody flex'>
            <div className='flightInfovhBody flex'>
                <div className='leftDiv'>
                    <div className='flightInfoFirstPart'>
                        <div className='flightInfo1Logo'>1</div>
                        <h1>Review your itinerary</h1>
                    </div>
                    <div className='flightInfo-cardDetails'>
                        <div className='flightInfo-s-t-d flex g20'>
                            <div className='source-to-destination flex'>
                                {dataa && objDropDownState.map((item, index) => (<p key={index}>{item.name == dataa.source ? `${item.fname.match(/^([^,]+)/)[1]}` : ""}</p>))}&nbsp;
                                <p><svg viewBox='0 0 24 24' height='16' width='16'><g fill='none' fillRule='evenodd'><path fill='#FFF' ></path>
                                
                                </g></svg> </p>&nbsp;
                                {dataa && objDropDownState.map((item, index) => (<p key={index}>{item.name ==dataa.destination ? `${item.fname.match(/^([^,]+)/)[1]}` : ""}</p>))}
                            </div>
                            <div className='flightInfoDate'>
                                {`${day}, ${date}, ${month}, ${year}`}
                            </div>
                        </div>
                        <div className='flightInfo-cardPhases flex'>
                            <div className='flightInfo-cardPhase1st flex'>
                                <img src={logofinder(dataa)} alt='image'/>
                                <div className='flightInfo-flightName'>{airlineNamefinder(dataa)}</div>
                                <div className='flightInfo-flightID'>{dataa.flightID[0] + dataa.flightID[1]}-{dataa.flightID[dataa.flightID.length-3] + dataa.flightID[dataa.flightID.length-2]+dataa.flightID.length-1}</div>
                            </div>
                            <div className='flightInfo-cardPhase2nd'><svg width='9' height='97' viewBox='0 0 9 97'><g fill='none' fillRule='evenodd'>
                                <circle fill='#999' cx='4.5' cy='4.5'></circle> <circle fill='#999' cx='4.5' cy='92.5' r='4.5'></circle><path stroke='#999' strokeLinecap='square' strokeDasharray='7' d='M4.5 7v84'></path>  </g> </svg> </div>
                                <div className='flightInfo-cardPhase3rd'>
                                    <div className='flex'>
                                        <h2 className='flightInfo-departureTime'>{dataa.departureTime}</h2>&nbsp;&nbsp;&nbsp;
                                        <p className='flightInfo-source'>{dataa.source}</p>
                                    </div>
                                    <div className='clocksvg'><MdOutlineWatchLater />
                                        <svg width='20' height='20'>
                                       </svg>&nbsp;&nbsp; 0{dataa.duration}:00
                                    </div>
                                    <div className='flex'>
                                        <h2 className='flightInfo-arrivalTime'>{dataa.arrivalTime}</h2>&nbsp;&nbsp;&nbsp;<p className='flightInfo-source'>{dataa.destination}</p>
                                    </div>
                                </div>
                        </div>
                    </div>
                    <div className='flightInfo-SecondPart flex g20'>
                    <div className='flightInfo2Logo'>2</div>
                    <h1>Add contact details<br/><p>E-ticket will be sent to this email address and phone number</p></h1>
                    </div>
                    <div className='flightInfo-contactDetails flex'>
                        {!switcherForm &&
                        <form onSubmit={(e)=> personalInfosender(e)} className='flex'>
                            <label htmlFor='mobile'>Mobile number</label>
                            <input type='number' className='flightInfo-mobileInput' onClick={() => { popp("mobile")}} placeholder='Mobile number' ref={inputRef} value={phoneNumber} onChange={(e) => { setErrorContact(false); setPhoneNumber(e.target.value); numberError(e)}}/>
                            <label htmlFor='email'>Email address</label>
                            <input type='email' placeholder='Email address' onClick={() => {popp("email")}} value={email} onChange={(e)=>{setErrorContact(false); setEmail(e.target.value), emailError(e)}}/>
                            {errorContact && <p className='errorcontact'>Please enter a valid details</p>}
                            <button onClick={()=> {popp("button")}}>Submit</button>
                        </form>
                        }
                    </div>
                    <div className='flightInfo-ThirdPart flex g20'>
                    <div className='flightInfo3Logo'>3</div>
                    <h1>Add traveller details</h1>
                    </div>
                    {switcherForm && <>
                    <div className='flightInfo-travellerDetails flex g20'>
                        <label>Traveller name and gender</label>
                        <div className='flightInfo-travellerdiv flex g20'>
                            <input type='text' className='fname' placeholder='First name' value={details.fname} onChange={(e) =>{travellerInfo("dfname", `${e.target.value}`);}} onClick={() =>{popp("fname")}}/>
                            <input type='text' className='lname' placeholder='Last name' value={details.lname} onChange={(e) =>{travellerInfo("dlname", `${e.target.value}`);}} onClick={() =>{popp("lname")}}/>
                            <div className='gender flex b1' onClick={()=>{popp("gender")}}>
                                <input type='text' placeholder='Gender' className='gender' value={details.dgender} disabled/>
                                <IoIosArrowDown className={popp['gender'] ? 'gender-downarrow' : 'gender-uparrow'}/>
                                {pop && 
                                <div className='gender-pop flex'>
                                    <p onClick={() => {travellerInfo('dgender', 'Male'); setPop(false)}}>Male</p>
                                    <p onClick={() => {travellerInfo('dgender', 'Female'); setPop(false)}}>Female</p>
                                </div>
                            }
                            </div>
                        </div>
                        <label>Natiobality</label>
                        <div className='flex g10'>
                            <div className='country flex' onClick={() => {popp("country")}}>
                                <input type='text' className='country-input' placeholder='Country (e.g. India)' value={details.dcountry} disabled/>
                                <IoIosArrowDown className={pop["country"] ? "country-downArrow" : "country-upArrow"}/>
                                {pop["country"] &&
                                <div className='country-pop flex g10'>
                                    {countries.map((item, index) => (<div key={index} onClick={() => { travellerInfo("dcountry", item)}}>{item}</div> ))}
                                </div>
                                }
                            </div>
                        </div>
                        <div className='flightInfo-buttonDiv flex'>
                            <button onClick={() => {setSwitcherForm(false)}}>back</button>
                            <button onClick={() => {gotoPayment(); popp("submitDetails"); sendData();}}>Submit</button>
                        </div>
                    </div>
                    </>}
                </div>
                <div className='rightdiv flex'>
                    <div className='flightInfo-price flex'><p>Total price</p><h2>₹{CalculateTotalAmount()}</h2></div>
                    <div className='flightInfo-base-fair flex'><p>Base fare (travellers)</p><h2>₹{dataa.ticketPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</h2></div>
                    <div className='flightInfo-tax flex'><p>Taxes and fees</p><h2>₹{taxCalculate()}</h2></div>
                    <div className='flightInfo-medical-benifit flex'><p>Medi-cancel benefit<svg viewBox='0 0 12 12' className='ml-1 c-pointer c-secondary-500' height='14' width='14'><path fill='#3366cc' fillRule='evenodd'></path></svg></p>
                    <p><del>₹199</del>&nbsp;<span>Free</span></p></div>
                </div>
            </div>
        </div>
        }
        {!pageLoader && <div className=''></div>}
        <Footer/>
       </div>
     )

}