import React from "react";
import { Link, BrowserRouter as  Router,Routes, Route } from 'react-router-dom';

const StartingPage = () => {
    return(
        <div>
            <ul>
                <li> <Link to="/musicHome" className="list-buttons"> StorePage </Link> </li>
                {/* <li> <Link to="/storeUserPage" className="list-buttons">StoreUserPage</Link></li>
                <li> <Link to="/userAccount" className="list-buttons">userAccount</Link></li>
                <li> <Link to="/otpPass" className="list-buttons">OTP</Link></li> */}
            </ul>
        </div>
    )
}

export default StartingPage