import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import "./Hotels.css";
import Calendar from 'react-calendar';
import CarousalHotelUp from '../../smallComp/CarousalHotelUp';
import CarousalHotelBottom from '../../smallComp/CarousalHotelBottom';
import { months, days, roomAndpeople, baseAPI } from '../../components/Constants';
import { SlCalender } from "react-icons/sl";
import debounce from 'lodash.debounce';
import Navigation from '../../components/Navigation';


export default function Hotels() {
  const navigate = useNavigate();
  const [data, setData] = useState(new Set());
  const [dateGo, setDateGo] = useState(new Date());
  const [dayGo, setDayGo] = useState(days[dateGo.getDay()]);
  const [monthGo, setMonthGo] = useState(months[dateGo.getMonth()]);
  const [dateRe, setDateRe] = useState(new Date());
  const [dayRe, setDayRe] = useState(days[dateRe.getDay()]);
  const [monthRe, setMonthRe] = useState(months[dateRe.getMonth()]);
  const [pop, setPop] = useState({});
  const [rooms, setRooms] = useState(1);
  const [adult, setAdult] = useState(1);
  const [children, setChildren] = useState(0);
  const [inputValue, setInputValue] = useState('');

  const popKey = (val) => {
    setPop((prevPop) => {
      const newPop = { ...prevPop, [val]: !prevPop[val] };
      console.log('popKey called:', val, newPop);
      return newPop;
    });
  };

  const dateSetterRe = (date) => {
    if ((dateRe.getMonth()) < (date.getMonth()) || ((dateRe.getMonth()) === (date.getMonth()) && dateRe.getDate() < dateRe.getDate())) {
      setDateRe(date);
      setDayRe(days[date.getDay()]);
      setMonthRe(months[date.getMonth()]);
    }
  };

  const navigateToHotelResult = (e) => {
    e.preventDefault();
    console.log('navigateToHotelResult called');
    if (inputValue) {
      navigate(`/hotels/results?location=${inputValue.match(/^([^,]+)/)[1]}&rooms=${rooms}&adults=${adult}&childrens=${children}&date=${dateGo}`);
    }
  };

  const fetchDataHotelInputField = async (value) => {
    console.log('fetchDataHotelInputField called with value:', value);
    try {
      const response = await fetch(`${baseAPI}/hotel?search={"location":"${value}"}`, {
        method: "GET",
        headers: {
          projectID: "ti65fq50h0gi",
          "Content-type": "application/json",
        }
      });
      const result = await response.json();
      console.log('fetch result:', result);
      if (result.data && result.data.hotels) {
        const arr = result.data.hotels.map((item) => item.location);
        setData(new Set(arr));
        console.log('Data set:', arr);
      }
    } catch (error) {
      console.error(error);
      alert('Error fetching hotel data');
    }
  };

  const debouncedFetchDataHotelInputField = useCallback(debounce(fetchDataHotelInputField, 300), []);

  useEffect(() => {
    fetchDataHotelInputField("");
  }, []);

  useEffect(() => {
    if (inputValue) {
      debouncedFetchDataHotelInputField(inputValue);
    }
  }, [inputValue]);

  return (
    <div className='hotelMainPage'>
    
      <div>
        <div className='mainHotelFrontPage'>
          <h1 className='hotelMainHeading'>Search hotels</h1>
          <p className='hotelMainHeadingBottom'>Enjoy hassle-free bookings with Cleartrip</p>
          <form className='hotelMainPageForm' onSubmit={navigateToHotelResult}>
            <div className='formInputDiv' onClick={() => { popKey("input"); }}>
              <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none'></svg>
              <input
                type='text'
                onClick={() => { popKey("input"); }}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  debouncedFetchDataHotelInputField(e.target.value);
                  if (e.target.value.trim().length > 0) {
                    setPop({ input: true });
                  }
                }}
                placeholder='Enter locality, landmark, city or hotel'
              />
              {console.log('Input Value:', inputValue)}
              {console.log('Pop State:', pop)}
              {console.log('Data Size:', data.size)}
              {pop["input"] && data.size > 0 && (
                <div className='hotelsInputPopup'>
                  <p>Popular destinations</p>
                  {Array.from(data).map((item, index) => (
                    <div key={index} className='hotelMainPageInput' onClick={() => { setInputValue(item); setPop({ input: false }); }}>
                      <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' className='listItemHover dropDown-new'></svg>&nbsp;&nbsp;{item}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className='dateOuter'>
              <div className='datesDiv'>
                <div className='leftCalenderDiv' onClick={() => { popKey("go"); }}><SlCalender />
                  {`${dayGo}, ${monthGo} ${dateGo.getDate()}`}
                  {pop["go"] && (
                    <Calendar
                      minDate={new Date()}
                      onChange={(date, e) => {
                        e.stopPropagation();
                        popKey("go");
                        setDateGo(date);
                        setDayGo(days[date.getDay()]);
                        setMonthGo(months[date.getMonth()]);
                        dateSetterRe(date);
                      }}
                      value={dateGo}
                      className='calenderForGoing'
                    />
                  )}
                </div>
                <div className='rightCalenderDiv' onClick={() => { popKey("re"); }}>
                  {`${dayRe}, ${monthRe} ${dateRe.getDate()}`}
                  {pop["re"] && (
                    <Calendar
                      minDate={dateGo}
                      onChange={(date, e) => {
                        e.stopPropagation();
                        popKey("re");
                        setDateRe(date);
                        setDayRe(days[date.getDay()]);
                        setMonthRe(months[date.getMonth()]);
                      }}
                      value={dateRe}
                      className='calenderForGoing'
                    />
                  )}
                </div>
              </div>
              <div className='hotelsRoomSelectorDiv' onClick={() => { popKey("selector"); }}>
                <p>{`${rooms} Rooms, ${adult} Adults`}{children ? `, ${children} Children` : ''}</p>
                {pop["selector"] && (
                  <div className='hotelsPeoplePop'>
                    <p>Quick Select</p>
                    {roomAndpeople.map((item, index) => (
                      <div
                        key={index}
                        className='flex'
                        onClick={() => {
                          setRooms(item.room);
                          setAdult(item.adult);
                          setChildren(item.children);
                          popKey("selector");
                        }}
                      >
                        {`${item.room} Rooms, ${item.adult} Adults`}{item.children ? `, ${item.children} Children` : ''}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className='hotelsMainFormButtonDiv'>
              <button className={`hotelsMainFormButton ${!inputValue ? "buttonDisabled" : ""}`} type='submit' disabled={!inputValue}>
                Search hotels
              </button>
            </div>
          </form>
        </div>
        <div className='asideCarousalDiv'>
          <CarousalHotelUp />
          <div className='moreOffer'>
            <p>More offers</p>
            <Link to="./under-maintainance">
              <div>View all</div>
            </Link>
          </div>
          <CarousalHotelBottom />
        </div>
      </div>
    </div>
  );
}
