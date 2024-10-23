// Basic import.
import React from "react"

// Photo imports
import Logo from "../../Photos/EchoBond_logo.png"

// Import icon.
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookF, faInstagram, faXTwitter } from "@fortawesome/free-brands-svg-icons";

function Footer () {
    return (
        <div className="bg-black-400">    
            <footer className="pb-10"> 
                <hr className="border border-gray-500 mx-10" />
                <div className="flex flex-row justify-between">
                    <div className="flex flex-row">    
                        <img src={Logo} alt="Logo" className="w-12 h-12 mt-7 ml-16 select-none" />
                        <p className="text-md text-white mt-10 ml-5"> © 2024 Echobond. All rights reserved </p>
                    </div>
                    <div className="flex flex-row mt-10 mr-16 gap-6">
                        <FontAwesomeIcon icon={faFacebookF} className="text-white hover:text-blue-200 cursor-pointer text-lg pr-1" />
                        <FontAwesomeIcon icon={faInstagram} className="text-white hover:text-pink cursor-pointer text-lg" />
                        <FontAwesomeIcon icon={faXTwitter} className="text-white hover:text-gray-500 cursor-pointer text-lg" />
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Footer