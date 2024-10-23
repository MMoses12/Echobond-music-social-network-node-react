// Basic imports.
import React from "react"
import { useLocation } from "react-router-dom"

// Component Imports
import Navbar from "../components/HomePage/navbar"

function CV () {
    const location = useLocation()
    const CV = location.state.CV

    return (
        <div>
            <div className="navbar-box absolute w-full h-full bg-gradient-to-r from-start to-end">
                <Navbar isLogged={false} />
                <embed src={CV} type="application/pdf" className="w-full h-full" />
            </div>
        </div>
    )
}

export default CV