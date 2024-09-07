import React from 'react';
import './Footer.css';
import { footerlogo, footericon1, footericon2, footericon3, footericon4 } from './Constants';

export default function Footer(){
    return(
        <div className='footerMainOuterDiv'>
            <div className='footer flexa flexc'>
                <div className='footerMainDiv flex g20'>
                    <div className='footerMainDivInner'>
                        <div>{footerlogo}</div>
                        <div className='footerCardRight flex flexc'>
                            <div className='flexa footerCardRightUpper'>
                                <div className='flex g40'>
                                    <div className='flex g40'>
                                        <p>About Us</p>
                                        <p>Careers</p>
                                        <p>FAQ<span>s</span></p>
                                        <p>Support</p>
                                        <p>Collections</p>
                                        <p>Clearrip for Business</p>
                                        <p>Gift Cards</p>
                                    </div>                                    
                                </div>                                
                            </div>
                            </div>
                            </div> 
                            <div className='flex footercarsrightbottom'>
                                <div className='flex'>
                                    <span>©</span>
                                    <p className='wrap500'>2024 Cleartrip Pvt. Ltd.· Privacy ·Security ·Terms of Use ·Grievance Redressal</p>
                                </div>
                                <div className='logosocial flexa'>
                                    Connect
                                    {footericon1}
                                    {footericon2}
                                    {footericon3}
                                    {footericon4}
                                </div>
                            </div>
                        
                    
                </div>
            </div>
        </div>
    );
}