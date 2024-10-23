// Basic import.
import React from "react"

function ErrorMessage ({ error }) {
    return (
        <div>
            {error === "passwordMatch" && <p className="text-red-200 text-center font-bold pt-2"> Passwords don't match </p>}
            {error === "usernameError" && <p className="text-red-200 text-center font-bold pt-2"> Username already exists </p>}
            {error === "emailError" && <p className="text-red-200 text-center font-bold pt-2"> An account is already registered with this email </p>}
            {error === "loginError" && <p className="text-red-200 text-center font-bold"> Username and password don't match </p>}
            {error === "passwordLength" && <p className="text-red-200 text-center font-bold pt-2"> Password must be over 8 characters </p>}
            {error === "notCompleted" && <p className="text-red-200 text-center font-bold pt-2"> You must fill all the fields </p>}

            {/* Change user's data error */}
            {error === "oldPassword" && <p className="text-red-200 text-center font-bold pt-2"> You must enter the old password </p>}
        </div>
    )
}

export default ErrorMessage;