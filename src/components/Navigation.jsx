import React, {useState, useEffect} from 'react';
import "./Navigation.css";
import { NavLink, Outlet } from 'react-router-dom';
import { useAuthContext } from './ContextAllData';
import LoginSignup from '../smallComp/LoginSignup';
import { MdFlight } from "react-icons/md";
import { RiHotelLine } from "react-icons/ri";
import { IoBagOutline } from "react-icons/io5";
import Navbar from './navbar/Navbar';
import Footer from './Footer';
import logo from './assets/download.png'

export default function Navigation(){
    const {all, setAll, username} = useAuthContext();
    const [tokenAvailibility, setTokenAvailibility] = useState();
    const [profileToggle, setProfileToggle] =useState(false);
    const [loginCheck, setLoginCheck] = useState(false);

    //token availibility
    function checkLogin(){
        const token = JSON.parse(localStorage.getItem("token")) || [];
        if(typeof token == "string"){
            setTokenAvailibility(true);
        }
    }
    useEffect(() => {
        checkLogin();
    },[]);

    //finish token from localStorage
    function finishToken(){
        localStorage.removeItem("token");
        setTokenAvailibility(false);
        checkLogin();
    }

    return(
        <><div className='navFile'>
            {loginCheck && <LoginSignup setTokenAvailibility={setTokenAvailibility} checkLogin={checkLogin} formClose={setLoginCheck} />}
            <nav className='navUpperHome'>
                <NavLink to='/'>
                    
                </NavLink>
                <div className="headerImgText">
                    <img src={logo} className="logoImage" height={'20px'} width={'20px'}/>
                     <span className="logo">cleartrip</span>
                 </div>
                {!tokenAvailibility && <button className='loginoutBtn' onClick={() => setLoginCheck(true)}>Log in / Sign up</button>}
                {tokenAvailibility &&
                    <button className='profileBtn' onClick={(e) => { setProfileToggle(!profileToggle); } }>
                        <svg viewBox='0 0 14 14' height='16px' width='16px' className='c-inherit'><g fill='none' fillRule='evenodd'><react width='14' height='14' fill='#FFF' opacity='0'></react> <circle cx='7' cy='7' r='6.25' stroke='currentColor' strokeWidth='1.5'></circle> </g></svg>
                        {username || "User"}
                        {profileToggle &&
                            <>
                                <div className='profilePop'>
                                    <div className='profileSelectorDiv'>
                                        <div className='profileSelectorLeft'>
                                            <h5>Account</h5>
                                            <NavLink to="/bookeddetails"><p className='profileSelector'><svg viewBox='0 0 14 14' height='16' width='16' className='c-neutral-400'><g fill='none' fillRule='evenodd'><react width='14' height='14' fill='#FFF' opacity='0'></react> </g></svg><p>Trips</p> </p></NavLink>
                                            <NavLink to="/under-maintainance"><p className='profileSelector'><svg viewBox='0 0 14 14' height='16' width='16' className='c-neutral-400'><g fill='none' fillRule='evenodd'><react width='14' height='14' fill='#FFF' opacity='0'></react> </g></svg><p>Shortlists</p> </p></NavLink>
                                            <NavLink to="/under-maintainance"><p className='profileSelector'><svg viewBox='0 0 14 14' height='16' width='16' className='c-neutral-400'><g fill='none' fillRule='evenodd'><react width='14' height='14' fill='#FFF' opacity='0'></react> </g></svg><p>Travellers</p> </p></NavLink>
                                            <NavLink to="/under-maintainance"><p className='profileSelector'><svg viewBox='0 0 14 14' height='16' width='16' className='c-neutral-400'><g fill='none' fillRule='evenodd'><react width='14' height='14' fill='#FFF' opacity='0'></react> </g></svg><p>Cleartrip Wallet</p> </p></NavLink>
                                            <NavLink to="/under-maintainance"><p className='profileSelector'><svg viewBox='0 0 14 14' height='16' width='16' className='c-neutral-400'><g fill='none' fillRule='evenodd'><react width='14' height='14' fill='#FFF' opacity='0'></react> </g></svg><p>Hi-Five</p> </p></NavLink>
                                            <NavLink to="/under-maintainance"><p className='profileSelector'><svg viewBox='0 0 14 14' height='16' width='16' className='c-neutral-400'><g fill='none' fillRule='evenodd'><react width='14' height='14' fill='#FFF' opacity='0'></react> </g></svg><p>Expressway</p> </p></NavLink>
                                            <NavLink to="/under-maintainance"><p className='profileSelector'><svg viewBox='0 0 14 14' height='16' width='16' className='c-neutral-400'><g fill='none' fillRule='evenodd'><react width='14' height='14' fill='#FFF' opacity='0'></react> </g></svg><p>Profile</p> </p></NavLink>
                                            <NavLink to="/under-maintainance"><p className='profileSelector'><svg viewBox='0 0 14 14' height='16' width='16' className='c-neutral-400'><g fill='none' fillRule='evenodd'><react width='14' height='14' fill='#FFF' opacity='0'></react> </g></svg><p>Settings</p> </p></NavLink>
                                        </div>
                                        <div className='profileSelectorRight'>
                                            <h5>Quick tools</h5>
                                            <NavLink to="/under-maintainance"><p className='profileSelector rightPS'><svg viewBox='0 0 14 14' height='16' width='16' className='c-secondary-500'><g fill='none' fillRule='evenodd'><react width='14' height='14' fill='#FFF' opacity='0'></react> </g></svg><p>Cancellations</p> </p></NavLink>
                                            <NavLink to="/under-maintainance"><p className='profileSelector rightPS'><svg viewBox='0 0 14 14' height='16' width='16' className='c-secondary-500'><g fill='none' fillRule='evenodd'><react width='14' height='14' fill='#FFF' opacity='0'></react> </g></svg><p>Change flight</p> </p></NavLink>
                                            <NavLink to="/under-maintainance"><p className='profileSelector rightPS'><svg viewBox='0 0 14 14' height='16' width='16' className='c-secondary-500'><g fill='none' fillRule='evenodd'><react width='14' height='14' fill='#FFF' opacity='0'></react> </g></svg><p>Print ticket</p> </p></NavLink>
                                            <NavLink to="/under-maintainance"><p className='profileSelector rightPS'><svg viewBox='0 0 14 14' height='16' width='16' className='c-secondary-500'><g fill='none' fillRule='evenodd'><react width='14' height='14' fill='#FFF' opacity='0'></react> </g></svg><p>Print hotel voucher</p> </p></NavLink>
                                        </div>
                                    </div>
                                    <div className='signOutBtn' onClick={() => { finishToken(); setAll((prev) => ({ ...prev, ["token"]: "" })); } }>Log Out</div>
                                </div></>}
                    </button>}
            </nav>
           <div className='flex marginBottom'>
            <nav className='navLeftside'>
                <ul>
                    <NavLink to='/'> </NavLink>
                        <NavLink to='/flights'>
                            <li className='flex'>
                                <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' className='stroke'></svg>
                                <MdFlight />
                                <p>Flights</p>
                            </li>
                        </NavLink>
                       
                    
                    <NavLink to='/hotels'>
                        <li className='flex'>
                            <svg width='20px' height='20px' viewBox='0 0 24 24' fill='none' className='stroke'></svg>
                            <RiHotelLine />
                            <p>Hotels</p>
                        </li>
                    </NavLink>
                    {tokenAvailibility &&
                        <NavLink to='/bookeddetails'>
                            <li className='flex'>
                                <svg viewBox='0 0 14 14' height='16' width='16' className='c-neutral-400'></svg>
                                <IoBagOutline />
                                <p>My Trips</p>
                            </li>
                        </NavLink>
                        }
                </ul>
            </nav>
            <Navbar/>
            </div>
            <Outlet />
        <Footer />
        </div>
        </>
    )
}