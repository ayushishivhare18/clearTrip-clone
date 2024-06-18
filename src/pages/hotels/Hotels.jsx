import React, {useState, useEffect, useRef} from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Calendar from 'react-calendar'
import CarousalHotelUp from '../../smallComp/CarousalHotelUp'
import CarousalHotelBottom from '../../smallComp/CarousalHotelBottom'
import { months, days, roomAndpeople, baseAPI } from '../../components/Constants'

export default function Hotels(){
  const navigate = useNavigate();
  const [data, setData] = useState();
  const refrence = useRef();
  const [dateGo, setDateGo] = useState(new Date());
  const [dayGo, setDayGo] = useState(days[dateGo.getDay()]);
  const [monthGo, setMonthGo] = useState(months[dateGo.getMonth()]);
  const [dateRe, setDateRe] = useState(new Date());
  const [dayRe, setDayRe] = useState(days [dateRe.getDay()]);
  const [monthRe, setMonthRe] = useState(months[dateRe.getMonth()]);
  const [pop, setPop] = useState({});
  const [rooms, setRooms] = useState(1);
  const [adult, setAdult] = useState(1);
  const [children, setChildren] = useState(0);
  const [inputValue, setInputValue] = useState();

  function popKey(){
    setPop({})
    setPop({[val]: !pop[val]});
  }

  function dateSetterRe(date){
    if((dateRe.getMonth()) < (date.getMonth()) || ((dateRe.getMonth()) === (date.getMonth()) && dateRe.getDate() < dateRe.getDate())){
      setDateRe(date);
      setDayRe(days[date.getDay()]);
      setMonthRe(months[date.getMonth()]);
    }
  }

  function navigateToHotelResult(){
    if(inputValue != ""){
      navigate(`/hotels/results?location=${inputValue.match(/^([^,]+)/)[1]}&rooms=${rooms}&adults=${adult}&childrens=${children}&date=${dateGo}`)
    }
  }

  const fetchDataHotelInputField = async(value) =>{
    try{
      const response = (await fetch(`${baseAPI}/hotel?search={"location":"${value}"}`,
      {
        method: "GET",
        headers: {
          projectID: "ti65fq50h0gi",
          "Content-type": "application/json",
        }
      }
      )).json();
      const arr = response.data.hotels.map((item)=>{return item.location});
      setData(new Set(arr))
    }catch(error){
      alert(error);
    }
  }
  useEffect(() =>{
    fetchDataHotelInputField("");
  },[]);

  return(
    <div className='hotelMainPage'>
      <div>
        <div className='mainHotelFrontPage'>
          <h1 className='hotelMainHeading'>Search hotels</h1>
          <p className='hotelMainHeadingBottom'>Enjoy hassle free bookings with Cleartrip</p>
          <div className='hotelMainPageForm'>
            <div className='formInputDiv' onClick={()=>{popKey("input");}}>
              <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none'></svg>
              <input type='text' onClick={() => {popKey("input");}} value={inputValue} onChange={(e) => {setInputValue(e.target.value); fetchDataHotelInputField(e.target.value)}} placeholder='Enter locality, landmark, city or hotel'/>
              {pop["input"] && <div className='hotelsInputPopup'>
                <p>Popular destinations</p>
                {Array.from(data).map((item, index) =>(
                  <div key={index} className='hotelMainPageInput' onClick={()=> {popKey("input"); setInputValue(item)}}>
                    <svg xmlns='ttp://www.w3.org/2000/svg' width='24' height='24' fill='none' className='listItemHover dropDown-new'></svg>&nbsp;&nbsp;{item}
                  </div>
                ))}
                </div>}
            </div>
            <div className='dateOuter'>
              <div className='datesDiv'>
                <div className='leftCalenderDiv' onClick={() => {popKey("go")}}>{`${dayGo}, ${monthGo} ${dateGo.getDate()}`}
                {pop["go"] && <Calendar minDate={new Date()} onChange={(date, e)=>{e.stopPropagation(); popKey("go"); setDateGo(date); setDayGo(days[date.getDay()]); setMonthGo(months[date.getMonth()]); dateSetterRe(date)}} value={dateGo} className='calenderForGoing'/>}
                
                </div>
                <div className='rightCalenderDiv' onClick={() => {popKey("re")}}>{`${dayRe}, ${monthRe} ${dateRe.getDate()}`}
                {pop["re"] && <Calendar minDate={dateGo} onChange={(date, e)=>{e.stopPropagation(); popKey("re"); setDateRe(date); setDateRe(days[date.getDay()]); setMonthRe(months[data.getMonth()]) }} value={dateRe} className='calenderForGoing'/>} 
                </div>
              </div>
              <div className='hotelsRoomSelectorDiv' onClick={()=> {popKey("selector")}}>
                <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'></svg>
                <p>{`${rooms}Rooms, ${adult}Adults`}{children ? `${children} Children`:""}</p>
                {pop["selector"] && <div className='hotelsPeoplePop'>
                  <p>Quick Select</p>
                  {roomAndpeople.map((item, index) => (
                    <div key={index} className='flex' onClick={()=> {setRooms(item.room); setAdult(item.adult); setChildren(item.children); popKey("selector")}}>
                      {`${item.room} Rooms, ${item.adult} Adults`}{item.children ? `${item.children} Children` : ""}
                    </div>
                  ))}
                  </div>}
              </div>
            </div>
            <div className='hotelsMainFormButtonDiv'>
              <button className={`hotelsMainFormButton ${!inputValue ? "buttonDisabled" : ""}`} onClick={() => {navigateToHotelResult()}} disabled={!inputValue}>Search hotels</button>
            </div>
          </div>
        </div>
        <div className='sideCarousalDiv'>
          <CarousalHotelUp/>
          <div className='moreOffer'>
            <p>More offers</p>
            <Link to="./under-maintainance"><div>View all</div></Link>
          </div>
          <CarousalHotelBottom/>
        </div>
      </div>
    </div>
  )
}