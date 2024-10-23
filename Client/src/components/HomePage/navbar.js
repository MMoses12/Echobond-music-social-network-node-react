// Basic import.
import React from "react"
import { useNavigate } from "react-router-dom"

// Component import.
import UserDropdownMenu from "./userMenu"

// Photo imports
import Logo from "../../Photos/EchoBond_logo.png"

// Navbar item
function Navbar (user) {
    const navigate = useNavigate()

    const navigateLogIn = () => {
        (user.loginScreen) ? navigate("/login", { replace: true }) : navigate("/login")
    }

    const navigateRegister = () => {
        (user.loginScreen) ? navigate("/register", {replace: true}) : navigate("/register")
    }

    return (
        <nav className="bg-transparent w-full">
            <div className="flex flex-row justify-between">
                <div className="flex flex-row items-center w-fit mx-8 py-3">
                    <img src={Logo} alt="Logo" className="w-12 h-12 my-1 select-none"/>
                    <h4 className="ml-2 text-white font-Cyberfont text-xl text-blue font-exo select-none"> EchoBond </h4>
                </div>
                { (!user.isLogged) ?
                    <div className="flex flex-row justify-center items-center mr-8">
                        <button onClick={navigateLogIn} className="border border-purple-200 rounded-full bg-purple-200 hover:bg-purple-300 text-white px-4 py-1.5 mr-4 select-none"> Log In </button>
                        <button onClick={navigateRegister} className="border border-purple-200 rounded-full bg-purple-200 hover:bg-purple-300 text-white px-4 py-1.5 mr-4 select-none"> Sign Up </button>
                    </div>
                    :
                    <div>
                        <UserDropdownMenu />
                    </div>
                }
            </div>
        </nav>
    )
}

export default Navbar