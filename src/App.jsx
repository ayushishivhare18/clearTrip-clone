import { BrowserRouter,Routes, Route } from "react-router-dom";
import Header from "./components/header/Header";
import Navbar from "./components/navbar/Navbar";
import Flights from "./pages/flights/Flights";
import  Hotels  from "./pages/hotels/Hotels";
import Bus from "./pages/bus/Bus";
import Offers from "./pages/offers/Offers";
import MyTrips from "./pages/myTrips/MyTrips";
import Buisness from "./pages/buisness/Buisness";
import Support from "./pages/support/Support";

function App() {
  return (
    <BrowserRouter>
    <Header/>
    <Navbar/>
 
    <Routes>
      <Route path="/" element={<Flights/>}/>
      <Route path="/hotels" element={<Hotels/>}/>
      <Route path="/bus" element={<Bus/>}/>
      <Route path="/offers" element={<Offers/>}/>
      <Route path="/myTrips" element={<MyTrips/>}/>
      <Route path="/buisness" element={<Buisness/>}/>
      <Route path="/support" element={<Support/>}/>
    </Routes>
    </BrowserRouter>
   
  )
}
export default App;