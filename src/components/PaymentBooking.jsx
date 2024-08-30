import React, {useState, useRef} from 'react';
import { NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import "../components/PaymentBooking.css";
import { constructFrom } from 'date-fns';

export default function PaymentBooking(){
    const checkBoxRef = useRef();
    const inputFill = useRef([]);
    const upiInput = useRef();
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    let FirstName = JSON.parse(searchParams.get("FirstName"));
    let Email = JSON.parse(searchParams.get("Email"));
    let amount = searchParams.get("amount");
    const [termsError, setTermsError] = useState(false);
    const [UPIError, setUPIError] = useState(false);
    const [debitError, setDebitError] = useState(false);
    const [donePayment, setDonePayment] = useState(false);
    const [pop, setPop] = useState({"UPI": true});
    const [cardNumber, setCardNumber] = useState("");

    //card no. handler
    const handleChange = (e) => {
        const input = e.target.value.replace(/\D/g, '');
        let formattedInput = "";
        for(let i=0; i<input.length; i++){
            if(i>0 && i%4 === 0){
                formattedInput+='';

            }
            formattedInput +=input[i];
        }
        setCardNumber(formattedInput);
    };

    //popup manage
    function popp(key){
        setPop({});
        setPop((prev) =>({...prev, [key]: true}));
    };

    //terms and condition handle
    function termsCheck(){
        setTermsError(false);
    }

    //outline remove
    function outLineRemove(key){
        inputFill[key].style.outline = "none";
        setDebitError(false);
    }

    //card number spacing
    function errorCardNumber(key){
        if(!(/^\d{4} \d{4} \d{4} \d{4}$/.test(inputFill[0].value))){
            inputFill[key].style.outline = "0.5px solid red";
        }

    }

    //payment inputt format
    function maxLengthMaker(e, key){
        if(key === 4 && e.target.value.length > 4){
            e.target.value = e.target.value.slice(0,4);
        }
        else if(key === 2 && e.target.value.length > 4){
            e.target.value = e.target.value.slice(0,e.target.value.length-1);
        }
        else if(key === 1 && e.target.value.length > 2){
            e.target.value = e.target.value.slice(0,2);
        }
        else if(key === 1 && e.target.value.length > 12){
            e.target.value = e.target.value.slice(0,1);
        }
    }

    //payment done errors
    function paymentDone(){
        if(checkBoxRef.current.checked){
            if(pop["UPI"]){
                if(upiInput.current.value == "" || !(/.+@.+/ .test(upiInput.current.value))){
                    upiInput.current.style.outline=`0.5px solid red`
                    setUPIError(true);
                }

                else{
                    setDonePayment(true);
                    navigateLast();
                }
            }
            else{
                let boolean = true;
                Object.keys(inputFill).forEach(item => {
                    if(inputFill[item].value == ""){
                        inputFill[item].style.outline=`0.5px solid red`;
                        setDebitError(true);
                        boolean = false;
                    }
                    if(item == 2 && inputFill[2].value.length < 4 || item === 2 && inputFill[2].value < 2024){
                        inputFill[2].style.outline=`0.5px solid red`;
                        boolean = false;
                    }
                    if(item == 1 && inputFill[1].value > 12 || item === 1 && inputFill[1].value <= 0){
                        inputFill[1].style.outline=`0.5px solid red`;
                        boolean = false;
                    }
                })
                if(boolean){
                    setDonePayment(true);
                    navigateLast();
                }
            }
        }
        else{
            setTermsError(true);
        }
    }

    function navigateLast(){
        setTimeout(() => {
            navigate("/");
        },7000);
    }

    return(
        <>
        <div className='paymentBooking'>
            <nav>
                <NavLink to="/">
                    <svg width='107' height='24' viewBox='0 0 310 65' fill='none'></svg>
                </NavLink>
            </nav>
            <div className={`paymentBookingMainDiv ${donePayment ? "colorDiv" : ""}`}>
                {!donePayment && 
                <div className='paymentCardOuter'>
                    <h2>Pay to complete your booking</h2>
                    <div className='paymentBookingCard'>
                        <div className='paymentCardDiv1'>
                            <div className={`selectorCardPayment ${pop["UPI"] ? "colorSelectorPayment" : ""}`} onClick={() =>popp("UPI")}>UPI</div>
                            <div className={`selectorCardPayment ${pop["Debit"] ? "colorSelectorPayment" : ""}`} onClick={() =>popp("Debit")}>Debit/Credit card</div>
                        </div>
                        {pop["UPI"] && 
                        <><div className='paymentCardDiv1result'>
                                        <div className='paymentCardDiv2'>
                                        <h3>Enter UPI ID</h3>
                                        <input type='text' ref={upiInput} placeholder='Enter your UPI ID' onChange={() => { setUPIError(false); upiInput.current.style.outline = `none`; } } />
                                        {UPIError && <span>Please enter a valid UPI ID</span>}
                                        <p>Payment request will be sent to the phone no. linked to your UPI ID</p>
                                    </div><div className='paymentCardDiv3'><div className='lineVertical'></div><p>QR</p><div className='lineVertical'></div></div>
                                    <div className='paymentCardDiv4'>
                                        <h3>SCAN QR CODE</h3>
                                        <div className='QRCodePayment'></div>
                                    </div>
                                    </div>
                                    </>
                            }
                            {pop["Debit"] && 
                            <><div className='paymentCardDiv5'>
                                <h3>Enter card details</h3>
                                <label>Card number</label>
                                <input ref={(e) => {inputFill[0] =e}} value={cardNumber} maxLength={19} type='text' placeholder='Enter card number' onChange={(e) => {outLineRemove(0),errorCardNumber(0), handleChange(e)}}/>
                                <label>Expiry date</label>
                                <div>
                                    <input ref={(e) => {inputFill[1] = e}} className='expiryDate' type='number' placeholder='Month' onChange={(e) => {outLineRemove(1), maxLengthMaker(e,1)}}/>
                                    <input ref={(e) => {inputFill[2] = e}} max={"2024"} className='expiryDate' type='number' placeholder='Year' onChange={(e) => {outLineRemove(2), maxLengthMaker(e,2)}}/>
                                </div>
                                <label>Card holder name</label>
                                <input ref={(e) => {inputFill[3] = e}} type='text' placeholder='Name as on card' onChange={() => {outLineRemove(3)}}/>
                                <label>CVV</label>
                                 <input ref={(e) => {inputFill[4] = e}} className='cvvInput' type='number' placeholder='CVV' onChange={() => {outLineRemove(4), maxLengthMaker(e,4)}}/>
                                 {debitError && <span>Please enter all details correctly</span>}
                            </div>
                            </>
                            }
                    </div>
                    <div className='paymentChecker'>
                        <input type='checkbox' ref={checkBoxRef} onClick={() => {termsCheck()}}/>
                        <p>
                            <p>I understand and agree to the rules and restrictions of this fare, the booking policy, the privacy policy and the terms and conditions of Cleartrip and confirm address details entered are correct</p>
                            {termsError && <span>Please accept the terms and consitions to proceed with this booking</span>}
                        </p>
                        <div>
                            <h2>₹{amount}</h2>
                            <p>Total, inclusive of all taxes</p>
                        </div>
                    </div>
                    <button className='paymentButton' onClick={() => {paymentDone()}}>Pay now</button>
                </div>
                }
                {donePayment && 
                <div className='backgroundWhite'>
                    <p>{FirstName} ({Email})</p>
                    <p>Your payment is done</p>
                </div>
                }
            </div>
        </div>
        </>
    )
}