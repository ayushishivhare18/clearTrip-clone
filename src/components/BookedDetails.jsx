import React, { useState, useEffect, useMemo } from 'react';
//import './BookedDetails.css';
import { airlineNamefinder, logofinder, months3char } from './Constants';

export default function BookedDetails() {
    const [bookedShow, setBookedShow] = useState("flights");
    const [bookedData, setBookedData] = useState();
    const [toggkeCardFullDetails, setToggleCardFullDeatails] = useState({});

    function toggkeCardDetails(val) {
        setToggleCardFullDeatails({})
        setToggleCardFullDeatails({[val]: !toggkeCardDetails[val]});
    }
    function numberWithComma(num){
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    const fetchBookedData = useMemo(async() => {
        try{
            const response = await (await fetch(`https://academics.newtonschool.co/api/v1/bookingportals/booking/`,
            {
                method: "GET",
                headers: {
                    projectID: "ti65fq50h0gi",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`
                }
            }
            )).json();
            setBookedData(response.data);
        }catch(error){
            alert(error);
        }
    },[])
    useEffect(() =>{
        fetchBookedData();
    },[]);
    
    function visibleBooked(val){
        setBookedShow(val);
    }

    return(
        <div className='bookedDetailsMain'>
            {bookedData && 
            <div>
                <div className={`flex g10 historylogoOuterDiv`} >
                    <div className='historylogo'>Booking Details</div>  
                </div>
                <div className={`flex g10 historylogoOuterDiv`} >
                    <p className='flightHistoryButton flexi' onClick={() => {visibleBooked("flights")}}Flights></p>
                    <p className='flightHistoryButton flexi' onClick={() => {visibleBooked("hotels")}}Hotels></p>
                </div>
                <div className='bookedDetailsOverflow'>
                    {bookedShow == "flights" && 
                    <div className={`flex flexc g10`}>
                        {bookedData.map((item, index) => (item.flight && (
                            <div key={index} className='flightResultCardInner flex'>
                                <div  className='flightResultCardHeader flex flexc g20'>
                                    <div className='flexja g10'>
                                        <div className='bookingDate'>
                                            <p className='nowrap'>Booked At:</p>
                                            <p className={`posteddate nowrap`}>{item.start_date[8]}{item.start_date[9]}{months3char[(parseInt(item.start_date[5] == 1 ? 10 : 0)+parseInt(item.start_date[6]))-1]}, {item.start_date[0]}{item.start_date[1]}{item.start_date[2]}{item.start_date[3]} </p>
                                        </div>
                                        <img src={logofinder(item.flight)}/>
                                        <div>
                                            <p className='flightName'>{airlineNamefinder(item.flight)}</p>
                                            <p className='flightId'>{`${item.flight.flightID[0]}${item.flight.flightID[1]}-${item.flight.flightID[item.flight.flightID.length-3]+item.flight.flightID[item.flight.flightID.length-2]+item.flight.flightID[item.flight.flightID.length-1]}`}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='flightResultDepartureTime'>{item.flight.departureTime} </div>
                                <div className='flightResultDeparture flexja flexc'>
                                    <p className='flightresultDuration'>{item.flight.duration}h 00m</p>
                                    <div className='flightDurationandStopSeprator flexja'><div></div></div>
                                    <p className='flightresultStops'>{item.flight.stops == 0 ? "Non-stop" : item.flight.stops == 1 ? item.flight.stops + "Stop" : item.flight.stops + "Stops"}</p>
                                </div>
                                <div className='flightResultArrivalTime'>{item.flight.arrivalTime}</div>
                                <div className='flightPrice'>₹{numberwithComma(item.flight.ticketPrice)}</div>
                            </div>
                        )))}
                    </div>
                    }
                    {bookedShow == "hotels" && <div className={`flex flexc g10`}>
                        {bookedData.map((item, index)=>(item.hotel && (
                            <div key={index} className={`flex flex g10`}>
                                <div className='bookingData'>
                                    <p className='nowrap'>Booked At:</p>
                                    <p className={`posteddate nowrap`}>{item.start_date[8]}{item.start_date[9]}{months3char[(parseInt(item.start_date[5] == 1 ? 10 : 0)+parseInt(item.start_date[6]))-1]}, {item.start_date[0]}{item.start_date[1]}{item.start_date[2]}{item.start_date[3]}</p>
                                </div>
                                <div>{item.hotel.name},<br/>
                                {item.hotel.location}</div>
                            </div>
                        )))}
                        </div>}
                </div>
            </div>
            }
        </div>
    )
}