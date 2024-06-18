import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import Header from "./components/header/Header";
import Navbar from "./components/navbar/Navbar";
import Flights from "./pages/flights/Flights";
import  Hotels  from "./pages/hotels/Hotels";
import Bus from "./pages/bus/Bus";
import Offers from "./pages/offers/Offers";
import MyTrips from "./pages/myTrips/MyTrips";
import Buisness from "./pages/buisness/Buisness";
import Carousal from "./smallComp/Carousal";
import CarousalBottom from "./smallComp/CarousalBottom";
import FlightResult from "./components/FlightResult";
import ContextAllDataProvider from "./components/ContextAllData";
import FlightInfo from './components/FlightInfo';
import BookedDetails from './components/BookedDetails';
import Navigation from './components/Navigation';

function App() {
  return (
    
    <ContextAllDataProvider>
      <Router>
        
    <Header/>
    <Navbar/>
    <Carousal/>
    <CarousalBottom/>
  
   
 
    <Routes>
      <Route path="/" element={<Navigation/>}/>
      <Route path="/flights" element={<Navbar/>}/>
      <Route path="/bookeddetails" element={<BookedDetails/>}/>
      <Route path="/" element={<Flights/>}/>
      <Route path="/hotels" element={<Hotels/>}/>
      <Route path="/bus" element={<Bus/>}/>
      <Route path="/offers" element={<Offers/>}/>
      <Route path="/myTrips" element={<MyTrips/>}/>
      <Route path="/buisness" element={<Buisness/>}/>
      <Route path="/fligts/:searchQuery" element={<FlightResult/>}/>
      <Route path="/flights/search/:Info" element={<FlightInfo/>}/>

    </Routes>
    </Router>
    </ContextAllDataProvider>

  )
}
export default App;