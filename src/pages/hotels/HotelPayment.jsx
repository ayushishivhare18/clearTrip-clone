import React, {useState, useEffect, useRef, useMemo} from 'react';
import { NavLink,useLocation, useNavigate } from 'react-router-dom';
import {IoIosArrowDown} from 'react-icons/io';
import Footer from '../../components/Footer';
import "./HotelPayment.css";
import { countries, states, months, days, hotelpaymentStatefun, baseAPI, localTokens } from '../../components/Constants';

export default function HotelPayment(){
    const colorRating = useRef([]);
    const colorRatingHalf = useRef([]);
    const navigate = useNavigate();
    const inputRef = useRef();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    let hotel_id = searchParams.get("hotel_id");
    let adult = JSON.parse(searchParams.get("adults"));
    let children = JSON.parse(searchParams.get("childrens"));
    let rooms = searchParams.get("rooms");
    let roomNo =  JSON.parse(searchParams.get("roomno"));
    let daysOfWeek = searchParams.get("date");
    const dateObject = new Date(daysOfWeek);

    const [dataa, setDataa] = useState({});
    const {details, setdetails} = hotelpaymentStatefun();
    const [loader, setLoader] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] =useState("");
    const [errorContact, setErrorContact] = useState(false);
    const [pop, setPop] = useState({});
    const [switcherForm, setSwitcherForm] = useState(false);
    const [errorTravellerForm, setErrorTravellerForm] = useState(false);

    //popups
    function popp(key){
        setPop({});
        setPop((prev) => ({...prev,[key]: !pop[key]}));
    }

    //error handling phoneNo. and email to push to next page
    function personalInfoSender1(e) {
        e.preventDefault();
        if(phoneNumber.length == 10 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
            setdetails((prev) => ({...prev, dnumber: phoneNumber, demail: email}));
            setSwitcherForm(true);
            setPhoneNumber("");
            setEmail("");
        }else{
            setErrorContact(true);
        }
    }
    function travellerInfo(key, value){
        setdetails((prev) => ({...prev, [key]: value}));
    }

    //flight data sent to backend
    const sendData = async() =>{
        try{
            if(details.dnumber && details.demail && details.dfname && details.dlname && details.dgender && details.dcountry && details.dstate && details.dbillingAddress){
                const response =await(await fetch(`${baseAPI}/booking`,
                {
                    method: "POST",
                    headers: {
                        projectID: "ti65fq50h0gi",
                        Authorization: `Bearer ${localTokens}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        bookingType: "hotel",
                        bookingDetails: {
                            hotelId: `${hotel_id}`,
                            startDate: `${dateObject}`,
                            endDate: `${dateObject}`,
                        }
                    })
                }
                )).json();
            }
        }
        catch(error){
            alert(error);
        }
    }

    //reDirect to next page
    function goToPayment(){
        if(details.dnumber && details.demail && details.dfname && details.dlname && details.dgender && details.dcountry && details.dstate && details.dbillingAddress){
            const amount = calTotalAmount();
            navigate(`/hotels/results/hotelInfo/Info/paymentBooking?FirstName="${details.dfname}" &Email="${details.demail}" &amount=${amount}`);
        }else{
            setErrorTravellerForm(true);
        }
    }

    //error handling of email
    function emailError(e){
        const inputValue = e.target.value;
        const inputElement = e.target;
        if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue)){
            inputElement.style.outline = "1px solid green";
        }else{
            inputElement.style.outline = "none";
        }
    }

    //mobile number error handler
    function numberError(e){
        const inputValue = e.target.value;
        const inputElement = e.target;
        if(inputValue.length == 0){
            inputElement.style.outline = "none"
        }else if(inputValue.length == 10){
            inputElement.style.outline = "1px solid green";
        }
        else{
            inputElement.style.outline = "1px solid red";
        }
    }

    //calculate amount of rendering
    function calTotalAmount(){
        const val = ((dataa.rooms[roomNo].constDetails?.baseCost) * (adult+children));
        const add = val + dataa.rooms[roomNo].price + dataa.rooms[roomNo].costDetails.taxeesAndFees;
        return add.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }

    //fetch hotel data
    const fetchCardDetails = useMemo(async () => {
        try{
            const response = await (await fetch(`${baseAPI}/hotel/${hotel_id}`,
            {
                method: "GET",
                    headers: {
                        projectID: "ti65fq50h0gi",
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
                        "Content-Type": "application/json",
                    },
            }
            )).json();
            setDataa(response.data);
            setLoader(true);
            if(response.message == "success"){
                setTimeout(() => {
                    colorRatingManager(response.data.rating);
                },1000)
            }
            console.log(response);
        }catch(error){
            alert(error);
        }
    },[]);

    //rating with colors
    function colorRatingManager(rating){
        let count =1;
        while(count<=rating && colorRating[count-1]){
            colorRating[count-1].style.backgroundColor = "00aa6c";
            count++;
        }
        let ans = rating % 1;
        if(ans>0){
            colorRatingHalf[count-1].style.backgroundColor = "00aa6c";
        }
    }

    return(
        <>
        {loader && Object.keys(dataa).length > 0 &&
        <div className='hotelPayment'>
            <nav className='flex'>
                <NavLink to='/'>
                    <svg width='107' height='24' viewBox='0 0 310 65' fill='none' className='c-pointer'></svg>
                </NavLink>
            </nav>
            <div className='hotelPaymentBodyDiv flex g20'>
                <div className='hotelPaymentLeftDiv'>
                    <div className='flightInfo-firstPart flex g20'>
                        <div className='flightInfo1Logo'>1</div>
                        <h1>Review your itinerary</h1>
                    </div>
                    <div className='hotelPaymentCardDetails'>
                        <div className='hotelPaymentCardBorderDotted'>
                        <div className='hotelpaymentcardhalfballs1'></div>
                        <div className='hotelpaymentcardhalfballs2'></div>
                            <div className='hotelPaymentparallel'>
                                <div className='hotelPaymentStar'>{dataa.amenities.length}-star hotel in {dataa.location.match(/^([^,]+)/)[1]}</div>
                                <h1>{dataa.name}&nbsp;-&nbsp;{dataa.location.match(/^([^,]+)/)[1]}</h1>
                                <span className='flex'>
                                    {Number.isInteger(dataa.rating) ? `${dataa.rating}.0` : dataa.rating}/5
                                    &nbsp; &nbsp;<svg xmlns='http://www.w3.org/2000/svg' width='18' height='24' viewBox='0 0 18 12' className='hotelCardInfo-ownLogo'></svg>
                                    &nbsp;&nbsp;
                                    <div className='hotelCardInfo-colorRating' ref={(e) => {colorRating[0] =e}}><div className='hotelCardInfo-colorRatingHalf' ref={(e) => {colorRatingHalf[0] =e}}></div></div>
                                    <div className='hotelCardInfo-colorRating' ref={(e) => {colorRating[1] =e}}><div className='hotelCardInfo-colorRatingHalf' ref={(e) => {colorRatingHalf[1] =e}}></div></div>
                                    <div className='hotelCardInfo-colorRating' ref={(e) => {colorRating[2] =e}}><div className='hotelCardInfo-colorRatingHalf' ref={(e) => {colorRatingHalf[2] =e}}></div></div>
                                    <div className='hotelCardInfo-colorRating' ref={(e) => {colorRating[3] =e}}><div className='hotelCardInfo-colorRatingHalf' ref={(e) => {colorRatingHalf[3] =e}}></div></div>
                                    <div className='hotelCardInfo-colorRating' ref={(e) => {colorRating[4] =e}}><div className='hotelCardInfo-colorRatingHalf' ref={(e) => {colorRatingHalf[4] =e}}></div></div>
                                </span>
                            </div>
                            <img className='hotelpaymentCard-image' src={`${dataa.images[0]}`}></img>
                        </div>
                        <div className='hotelPaymentCardBottom'>
                            <div className='flex'>
                                <div className='hotelPaymentBottomLeftCard-1'>
                                    
                                        <p>Check-in</p>
                                        <h3>{dateObject.getDate()}&nbsp;{months[dateObject.getMonth()]}</h3>
                                        <p>{days[dateObject.getDay()]},{dateObject.getFullYear()}</p>
                                   
                                </div>
                                <span className='smallLine'/>
                                    <div className='hotelPaymentBottomLeftCard-2'>
                                        
                                            <p>Check-out</p>
                                            <h3>{dateObject.getDate()}&nbsp;{months[dateObject.getMonth()]}</h3>
                                            <p>{days[dateObject.getDay()]},{dateObject.getFullYear()}</p>
                                        
                                    </div>
                            </div>
                            <span/>
                            <div>
                                <div className='hotelPaymentBottomLeftCard-3'>
                                    <p>Rooms & Guests</p>
                                    <h3>{rooms} Room, {children+adult} Guests</h3>
                                    <p>{adult} adults {children ? `${children} children` : ""}</p>
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
                        <form onSubmit={(e)=> personalInfoSender1(e)} className='flex'>
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
                        <label>Billing Address</label>
                        <input className='flightinfo-billinginput' type='text' placeholder='Billing Address' onClick={() => { popp("billingAddress") }} value={details.dbillingAddress} onChange={(e) => { travellerInfo("dbillingAddress", e.target.value); setErrorTravellerForm(false) }} />
                        <label>Traveller name and gender</label>
                        <div className='flightInfo-travellerdiv flex g20'>
                            <input type='text' className='fname' placeholder='First name' value={details.dfname} onChange={(e) =>{travellerInfo("dfname", `${e.target.value}`); setErrorTravellerForm(false) }} onClick={() =>{popp("fname")}}/>
                            <input type='text' className='lname' placeholder='Last name' value={details.dlname} onChange={(e) =>{travellerInfo("dlname", `${e.target.value}`); setErrorTravellerForm(false)}} onClick={() =>{popp("lname")}}/>
                            <div className='gender flex b1'  onClick={()=>{ console.log('clicked')
                            setPop(prev => !prev);
                            setErrorTravellerForm(false)}}>
                                <input type='text' placeholder='Gender' className='gender' value={details.dgender} disabled/>
                                <IoIosArrowDown className={popp['gender'] ? 'gender-downarrow' : 'gender-uparrow'}/>
                                {pop && 
                                <div className='gender-pop flex'>
                                    <p onClick={() => {travellerInfo('dgender', 'Male'); setErrorTravellerForm(false); setPop(false) }}>Male</p>
                                    <p onClick={() => {travellerInfo('dgender', 'Female'); setErrorTravellerForm(false); setPop(false)}}>Female</p>
                                </div>
                            }
                            </div>
                        </div>
                        <label>Natiobality</label>
                        <div className='flex g10'>
                            <div className='country flex' onClick={() => {popp("country"); setErrorTravellerForm(false)}}>
                                <input type='text' className='country-input' placeholder='Country (e.g. India)' value={details.dcountry} disabled/>
                                <IoIosArrowDown className={pop["country"] ? "country-downArrow" : "country-upArrow"}/>
                                {pop["country"] &&
                                <div className='country-pop flex g10'>
                                    {countries.map((item, index) => (<div key={index} onClick={() => { travellerInfo("dcountry", item); setErrorTravellerForm(false)}}>{item}</div> ))}
                                </div>
                                }
                            </div>
                            <div className='state flex' onClick={() => {popp("state"); setErrorTravellerForm(false)}}>
                                <input type='text' className='state-input' placeholder='State (e.g. India)' value={details.dstate} disabled/>
                                <IoIosArrowDown className={pop["state"] ? "country-downArrow" : "country-upArrow"}/>
                                {pop["state"] &&
                                <div className='state-pop flex g10'>
                                    {states.map((item, index) => (<div key={index} onClick={() => { travellerInfo("dstate", item); setErrorTravellerForm(false)}}>{item}</div> ))}
                                </div>
                                }
                            </div>
                        </div>
                       {errorTravellerForm && <div className='errorTravellerForm'>Pls fill the forms Correctly</div>}
                        <div className='flightInfo-buttonDiv flex'>
                            <button onClick={() => {setSwitcherForm(false)}}>back</button>
                            <button onClick={() => {goToPayment(); popp("submitDetails"); sendData();}}>Submit</button>
                        </div>
                    </div>
                    </>}
                    </div>
                   <div className='hotelPaymentRightDiv'>
                    <div className='rightDiv'>
                        <div className='flightInfo-price'><p>Total</p><h2>₹{calTotalAmount}</h2></div>
                        <div className='flightInfo-base-fare'><p>Room charge</p>₹{dataa.rooms[roomNo].price}</div>
                        <div className='flightInfo-base-fare'><p>Per Guest Charges</p>₹{dataa.rooms[roomNo].costDetails.baseCost}</div>
                        <div className='flightInfo-base-fare'><p>Guests</p>{adult} adults{children ? `, ${children} children` : ""}</div>
                        <div className='flightInfo-tax'><p>Taxes and fees</p><p>₹{dataa.rooms[roomNo].costDetails.taxesAndFees}</p></div>
                        <div className='flightInfo-medicalBenifit'><p>Medi cancel benifit</p><del>₹199</del>&nbsp;<span>Free</span></div>
                    </div>
                   </div>
                </div>
            
            <Footer/>
        </div>
        }
        {!loader && <div className='dual-ring'></div>}
        </>
    )


}