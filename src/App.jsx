import {useEffect, useState} from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';

import Navbar from "./components/navbar/Navbar";
import Navigation from './components/Navigation';

import  Hotels  from "./pages/hotels/Hotels";
import FlightResult from "./components/FlightResult";
import HotelResult from './components/HotelResult';
import FlightInfo from './components/FlightInfo';
import HotelCardInfo from './components/HotelCardInfo';
import HotelPayment from './pages/hotels/HotelPayment';
import ContextAllDataProvider from "./components/ContextAllData";
import Carousal from "./smallComp/Carousal";
import CarousalBottom from "./smallComp/CarousalBottom";
import PaymentBooking from './components/PaymentBooking';
import Errorpage from './components/ErrorPage';
import BookedDetails from './components/BookedDetails';


function App() {
  return (
    <div className='app'>
    <ContextAllDataProvider>
      <Router>
    
    <Routes>
    
      <Route path="/" element={<Navigation/>}/>
      {/*<Route index element={<Navbar/>}/>*/}
     <Route path="/flights" element={<Navbar/>}/>
      <Route path="/hotels" element={<Hotels/>}/>
      <Route path="/bookeddetails" element={<BookedDetails/>}/>
      <Route/>
      <Route path="/flights/:results" element={<FlightResult/>}/>
      <Route path="/hotels/:results" element={<HotelResult/>}/>
      <Route path="/flights/results/:Info" element={<FlightInfo/>}/>
      <Route path="/flights/results/flightInfo/:paymentBooking" element={<PaymentBooking/>}/>
      <Route path="/hotels/results/:hotelInfo" element={<HotelCardInfo/>}/>
      <Route path="/hotels/results/hotelInfo/:info" element={<HotelPayment/>}/>
      <Route path="/hotels/results/hotelInfo/Info/:paymentBooking" element={<PaymentBooking/>}/>
      <Route path="/under-maintainance" element={<Errorpage/>}/>
      
     {/* /* /*{ <Route path="/results" element={<FlightResult/>}/>}*/ }

    </Routes>
    </Router>
    </ContextAllDataProvider>
    </div>

  )
}
export default App;