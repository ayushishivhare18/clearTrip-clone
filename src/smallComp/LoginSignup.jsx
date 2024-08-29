import React, { useState } from 'react';
import { useAuthContext } from '../components/ContextAllData.jsx';
import { baseAPI } from '../components/Constants';
import "./LoginSignup.css";
import CarousalThree from '../smallComp/CarousalThree';

export default function LoginSignup({ setTokenAvailibility, checkLogin, formClose}){
    const [pagination, setPagination] = useState(true);
    const {all, setAll} = useAuthContext();
    const [error, setError] = useState(false);
    const [signName, setSignName] = useState("");
    const [signEmail, setSignEmail] = useState("");
    const [signPassword, setSignPassword] = useState("");
    const [signGender, setSignGender] = useState("");
    const [LoginEmail, setLoginEmail] = useState("");
    const [LoginPassword, setLoginPassword] = useState("");
    const [errorLogin, setErrorLogin]= useState(false);
    const [userErrorExist, setUserErrorExist] = useState(false);

    //Signup API and signup handler
    const signUpFunc = async(e) =>{
        e.preventDefault(e);
        if(signName && signEmail && signPassword && signGender){
            try{
                const response = await (await fetch (`${baseAPI}/signup`,
                {
                    method: "POST",
                    headers: {
                        projectID: "ti65fq50h0gi",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: `${signName}`,
                        email: `${signEmail}`,
                        password: `${signPassword}`,
                        appType: "bookingportals"
                    })
                }
                )).json();
                if(response.status == "fail" && response.message == "User already exists"){
                    setUserErrorExist(true);
                }
                if(response.status == "success"){
                    localStorage.setItem("username", JSON.stringify(response.data.user.name));
                    console.log(response);
                    localStorage.setItem("token",JSON.stringify(response.token));
                    formClose(false);
                    setTokenAvailibility(true);
                    setAll((prev) => ({...prev, ["token"]: response.token}));
                }
            }catch(error){
                alert(error);
            }
            setSignEmail("");
            setSignName("");
            setSignPassword("");
            setSignGender("");
        }else{
            setError(true);
        }
    }

    //SignIn API and SignIn handler
    const logInFunc = async(e)=>{
        e.preventDefault(e);
        if(LoginEmail && LoginPassword){
            try{
                const response = await (await fetch (`${baseAPI}/login`,
                {
                    method: "POST",
                    headers: {
                        projectID: "ti65fq50h0gi",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: `${LoginEmail}`,
                        password: `${LoginPassword}`,
                        appType: "bookingportals"
                    })
                }
                )).json();
                if(response?.status == "success"){
                    console.log("response",response);
                    localStorage.setItem("username", JSON.stringify(response.data.name));
                   localStorage.setItem("token",JSON.stringify(response.token));
                    setAll((prev) => ({...prev, ["token"]: response.token}));
                    formClose(false);
                    setTokenAvailibility(true);    
                }else{
                    setErrorLogin(true);
                }
            }
            catch(error){
                alert(error);
            }
            setLoginEmail("");
            setLoginPassword("");
            }else{
                setError(true);
            }
        }
    
        return(
            <div className='loginBlackBlur'>
                <div className='loginMainDiv'>
                    <div className='leftLogin'><CarousalThree/></div>
                    <div className='rightLogin'>
                        <div className='crossSign'>
                            <svg onClick={() => { formClose(false); setTimeout(() => {checkLogin(); },3000);}} width="22" height="22" viewBox="0 0 24 24" fill="none" className=" c-pointer c-neutral-900"><path  stroke="#1A1A1A" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                        </div>
                        {pagination ?
                    (<form className='loginForm flex-1a' onSubmit={(e) => logInFunc(e)}>
                        <fieldset className='flex-1a'>
                            <legend>Email</legend>
                            <input type='email' id='email' name='email' value={LoginEmail} onChange={(e) => {setErrorLogin(false); setError(false); setLoginEmail(e.target.value)}}/><br/>
                        </fieldset>
                        <fieldset className='flex-1a'>
                            <legend>Password</legend>
                            <input type='password' id='password' name='password' value={LoginPassword} onChange={(e) => {setErrorLogin(false); setError(false); setLoginPassword(e.target.value)}}/><br/>
                        </fieldset>
                        {errorLogin && <p className='errorLogin'>Incorrect EmailId or Password</p>}
                        {error && <p className='error'>Email or Password is Missing</p>}
                        <button type='submit' className='submitLogin'>Login</button>
                        <p className='gotoSignup' onClick={() => {setError(false); setPagination(false)}}>SignUp</p>
                    </form>) :
                    (
                        <form className='formSignUp' onSubmit={(e) =>signUpFunc(e)}>
                            <fieldset className='flex'>
                                <legend>Name</legend>
                                <input type='text' id='name' name='name' value={signName} onChange={(e) => {setError(false); setSignName(e.target.value)}}/>
                            </fieldset>
                            <fieldset className='flex'>
                                <legend>Email</legend>
                                <input type='email' id='email' name='email' value={signEmail} onChange={(e) => {setError(false); setSignEmail(e.target.value)}}/>
                            </fieldset>
                            <fieldset className='flex'>
                                <legend>Password</legend>
                                <input type='password' id='password' name='password' value={signPassword} onChange={(e) => {setError(false); setSignPassword(e.target.value)}}/>
                            </fieldset>
                            <fieldset className='genderFieldSet flex'>
                                <legend>Gender</legend>
                                <label form='gender' className='flex g20'>
                                    <p className='flex'><input type='radio' id='male' name='gender' value='Male' checked={signGender=='Male'} onChange={() =>{setError(false);setSignGender('Male')}}/>&nbsp;Male </p>
                                    <p className='flex'><input type='radio' id='female' name='gender' value='Female' checked={signGender=='Female'} onChange={() =>{setError(false);setSignGender('Female')}}/>&nbsp;Female </p>
                                    <p className='flex'><input type='radio' id='other' name='gender' value='Other' checked={signGender=='Other'} onChange={() =>{setError(false);setSignGender('Other')}}/>&nbsp;Other </p>
                                </label>
                            </fieldset>
                            {error && <p className='errors'>Please Fill The Required Fields</p>}
                            {userErrorExist && <p className='errors'>User Already Exists</p>}
                            <button type='submit' className='submitSignup'>Sign Up</button>
                            <p className='backToLogin' onClick={() => {setError(false); setPagination(true)}}>Back to Login</p>
                          
                        </form>
                    )
                    }
                    </div>
                </div>
            </div>
        )
}
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NzFhZDQ3NmMzNmYzNzkwMTM5NmM2NiIsImlhdCI6MTcxODcyNTk1OSwiZXhwIjoxNzUwMjYxOTU5fQ.-0YSjfDe7_F5L7lV0wZdsdTCQXP7wvv7o2a6dn13F10