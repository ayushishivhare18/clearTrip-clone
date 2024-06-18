import React, {useState, useEffect, useRef, useMemo} from 'react';
import { NavLink,useLocation, useNavigate } from 'react-router-dom';
import {IoIosArrowDown} from 'react-icons/io';
import Footer from '../../components/Footer';
import "../pages/hotels/HotelPayment.css";
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
    let roomNo =  JSON.parse(searchParams.get("roomNo"));
    let daysOfWeek = searchParams.get("date");
    const dateObject = new Date(daysOfWeek);

    const [data, setData] = useState({});
    const {details, setDetails} = hotelpaymentStatefun();
    const [loader, setLoader] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] =useState("");
    const [errorContact, setErrorContact] = useState(false);
    const [pop, setPop] = useState({});
    const [switcherForm, setSwitcherForm] = useState(false);
    const [errorTravellerForm, setErrorTravellerForm] = useState(false);

    //popups
    function pop(key){
        setPop({});
        setPop((prev) => ({...prev,[key]: !pop[key]}));
    }

    //error handling phoneNo. and email to push to next page
    function personalInfoSender1(e) {
        e.preventDefault();
        if(phoneNumber.length == 10 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
            setDetails((prev) => ({...prev, dnumber: phoneNumber, demail: email}));
            setSwitcherForm(true);
            setPhoneNumber("");
            setEmail("");
        }else{
            setErrorContact(true);
        }
    }
    function travellerInfo(key, value){
        setDetails((prev) => ({...prev, [key]: value}));
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
            const amount = calculateTotalAmount();
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
        const val = ((data.rooms[roomNo].constDetails.baseCost) * (adult+children));
        const add = val + data.rooms[roomNo].price + data.rooms[roomNo].costDetails.taxeesAndFees;
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
            setData(response.data);
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
        {loader && Object.keys(data).length > 0 &&
        <div className='hotelPayment'>
            <nav className='flex'>
                <NavLink to='/'>
                    <svg width='107' height='24' viewBox='0 0 310 65' fill='none' className='c-pointer'></svg>
                </NavLink>
            </nav>
            <div className='hotelPaymentBodyDiv flex g20'>
                <div className='hotelPaymentLeftDiv'>
                    <div className='flightInfo-firstPart flex g20'>
                        <div className='flightInfo-1-logo'>1</div>
                        <h1>Review your itinerary</h1>
                    </div>
                    <div className='hotelPaymentCardDetails'>
                        <div className='hotelPaymentCardBorderDotted'>
                            <div className='flex'>
                                <div className='hotelPaymentStar'>{data.aminities.length}-star hotel in {data.location.match(/^([^,]+)/)[1]}</div>
                                <h1>{data.name}&nbsp;-&nbsp;{data.location.match(/^([^,]+)/)[1]}</h1>
                                <span className='flex'>
                                    {Number.isInteger(data.rating) ? `${data.rating}.0` : data.rating}/5
                                    &nbsp; &nbsp;<svg xmlns='http://www.w3.org/2000/svg' width='18' height='24' viewBox='0 0 18 12' className='hotelCardInfo-ownLogo'></svg>
                                    &nbsp;&nbsp;
                                    <div className='hotelCardInfo-colorRating' ref={(e) => {colorRating[0] =e}}><div className='hotelCardInfo-colorRatingHalf' ref={(e) => {colorRatingHalf[0] =e}}></div></div>
                                    <div className='hotelCardInfo-colorRating' ref={(e) => {colorRating[1] =e}}><div className='hotelCardInfo-colorRatingHalf' ref={(e) => {colorRatingHalf[1] =e}}></div></div>
                                    <div className='hotelCardInfo-colorRating' ref={(e) => {colorRating[2] =e}}><div className='hotelCardInfo-colorRatingHalf' ref={(e) => {colorRatingHalf[2] =e}}></div></div>
                                    <div className='hotelCardInfo-colorRating' ref={(e) => {colorRating[3] =e}}><div className='hotelCardInfo-colorRatingHalf' ref={(e) => {colorRatingHalf[3] =e}}></div></div>
                                    <div className='hotelCardInfo-colorRating' ref={(e) => {colorRating[4] =e}}><div className='hotelCardInfo-colorRatingHalf' ref={(e) => {colorRatingHalf[4] =e}}></div></div>
                                </span>
                            </div>
                            <img className='hotelpaymentCard-image' src={`${data.images[0]}`}></img>
                        </div>
                        <div className='hotelPaymentCardBottom'>
                            <div className='flex'>
                                <div className='hotelPaymentBottomLeftCard-1'>
                                    <div className='flex g5'>
                                        <p>Check-in</p>
                                        <h3>{dateObject.getDate()}&nbsp;{months[dateObject.getMonth()]}</h3>
                                        <p>{days[dateObject.getDay()]},{dateObject.getFullYear()}</p>
                                    </div>
                                </div>
                                <span className='smallLine'/>
                                    <div className='hotelPaymentBottomLeftCard-2'>
                                        <div className='flex g5'>
                                            <p>Check-out</p>
                                            <h3>{dateObject.getDate()}&nbsp;{months[dateObject.getMonth()]}</h3>
                                            <p>{days[dateObject.getDay()]},{dateObject.getFullYear()}</p>
                                        </div>
                                    </div>
                            </div>
                            <span/>
                            <div>
                                <div className='flex g5'>
                                    <p>Rooms & Guests</p>
                                    <h3>{rooms} Room, {children+adult} Guests</h3>
                                    <p>{adult} adults {children ? `${children} children` : ""}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='hotelInfo-secondPart'>
                        <div className='hotelInfo2-logo'>2</div>
                        <h1>Guest details</h1>
                        <p>Booking details will be sent to this number and email address</p>
                    </div>
                    <div className='hotelInfo-contactDetails'>
                        {switcherForm &&
                        <form onSubmit={(e) => personalInfoSender1(e)} className='flex'>
                            <label htmlFor='mobile'>Mobile number</label>
                            <input type="number" className='hotelinfo-mobileinput' onClick={() => { pop("mobile") }} placeholder=' Enter mobile number' ref={inputRef} value={phoneNumber} onChange={(e) => { setErrorContact(false); setPhoneNumber(e.target.value); numberError(e) }} />
                            <label htmlFor="email">Email address</label>
                            <input type='email' placeholder='Email address' onClick={() => { pop("email") }} value={email} onChange={(e) => { setErrorContact(false); setEmail(e.target.value), emailError(e) }} />
                            {errorContact && <p className='errorcontact'>fill the form correctly</p>}
                            <button onClick={() => { pop("button") }}>Submit</button>
                        </form>
                        }
                    </div>
                   <div className='hotelPaymentRightDiv'>
                    <div className='rightDiv'>
                        <div className='flightInfo-price'><p>Total</p><h2>₹{calTotalAmount}</h2></div>
                        <div className='flightInfo-base-fare'><p>Room charge</p>₹{data.rooms[roomNo].price}</div>
                        <div className='flightInfo-base-fare'><p>Per Guest Charges</p>₹{data.rooms[roomNo].costDetails.baseCost}</div>
                        <div className='flightInfo-base-fare'><p>Guests</p>{adult} adults{children ? `, ${children} children` : ""}</div>
                        <div className='flightInfo-tax'><p>Taxes and fees</p><p>₹{data.rooms[roomNo].costDetails.taxesAndFees}</p></div>
                        <div className='flightInfo-medicalBenifit'><p>Medi cancel benifit</p><del>₹199</del>&nbsp;<span>Free</span></div>
                    </div>
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