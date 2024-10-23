// Basic imports.
import React,{ useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

// Import axios for requests.
import axios from 'axios';

// Token decoder.
import { jwtDecode } from 'jwt-decode';

// Component imports.
import CountrySelection from "../components/countrySelection";
import ErrorMessage from "../components/errorMessage"

// For toast.
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import icons.
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons' 

function User (user) {
    const [password, setPassword] = useState('')
    const [oldPassword, setOldPassword] = useState('')
    const [email, setEmail] = useState('')
    const [country, setCountry] = useState('')
    const [userPhoto, setUserPhoto] = useState('')

    const [changeImage, setChangeImage] = useState('')
    const [error, setError] = useState('')

    const navigate = useNavigate()

    // Notify user.
    const notify = (message) => {
        toast(message)
    }

    // Get username from the token.
    const getUsernameFromToken = () => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            return null;
        }
    
        try {
            const decodedToken = jwtDecode(accessToken)
            return decodedToken.username; // Assuming the username is stored in the token under 'username'
        } catch (error) {
            navigate("/", { replace: true })
            
            return null;
        }
    }

    // Get photo from user's file input.
    const changeUserPhoto = (event) => {
        const photo = event.target.files[0];

        let reader = new FileReader();

        reader.onload = (e) => {
            const imageDataUrl = e.target.result;
            setChangeImage(imageDataUrl); // Update the state with the Base64 encoded image
            console.log(imageDataUrl);
        };

        reader.readAsDataURL(photo); // Read the image file and encode it as Base64
    };

    // Change password.
    const changePassword = (event) => {
        setPassword(event.target.value)

        // Check if two passwords do not match.
        if (event.target.value.length < 8 && event.target.value.length > 0) {
            setError("passwordLength")
        }
        else {
            setError("")
        }
    }

    // Change confirm password.
    const changeOldPassword = (event) => {
        setOldPassword(event.target.value)
    }
    
    // Change email.
    const changeEmail = (event) => {
        setEmail(event.target.value)
    }

    // Submit the changes.
    const submitData = (event) => {
        event.preventDefault()

        if (!oldPassword) {
            setError("oldPassword")
            return
        }

        // Check if nothing is inserted.
        if ((!password && !email && !country)) {
            return
        }

        if (event.type !== "submit") {
            console.log("Hi")
            return
        }

        // Check if two passwords do not match.
        if (password.length < 8) {
            setError("passwordLength")
            return
        }

        const accessToken = localStorage.getItem('accessToken');
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

        axios.patch("http://100.91.43.32:4000/user/change-user-data", { country, email, password, oldPassword })
        .then(response => {
            notify("Data changed with success!")
        })
        .catch(error => {
            const refreshToken = localStorage.getItem('refreshToken');
            axios.defaults.headers.common['Authorization'] = `Bearer ${refreshToken}`

            axios.get("http://100.91.43.32:4000/token/refresh-token")
            .then(response => {
                localStorage.setItem('accessToken', response.data.accessToken)
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`

                axios.patch("http://100.91.43.32:4000/user/change-user-data", { country, email, password, oldPassword })
                .then(response => {
                    notify("Data changed with success!")
                })
            })
            .catch(error => {
                navigate("/", { replace: true })
            })
        })
    }

    // Delete user's account.
    const deleteAccount = () => {
        const accessToken = localStorage.getItem('accessToken');
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

        axios.delete("http://100.91.43.32:4000/user/delete-account")
        .then(response => {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')

            navigate("/", { replace: true })
        })
        .catch(error => {
            const refreshToken = localStorage.getItem('refreshToken');
            axios.defaults.headers.common['Authorization'] = `Bearer ${refreshToken}`

            axios.get("http://100.91.43.32:4000/token/refresh-token")
            .then(response => {
                localStorage.setItem('accessToken', response.data.accessToken)
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`

                axios.delete("http://100.91.43.32:4000/user/delete-account")
                .then(response => {
                    navigate("/", { replace: true })
                })
            })
            .catch(error => {
                navigate("/", { replace: true })
            })
        })
    }

    // Get initial user's info.
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

        axios.get("http://100.91.43.32:4000/user/get-user-info")
        .then(response => {
            console.log(response.data.userInfo.Photo)
            setUserPhoto(response.data.userInfo.Photo)
            setEmail(response.data.email)
            setCountry(response.data.Country)
        })
        .catch(error => {
            const refreshToken = localStorage.getItem('refreshToken');
            axios.defaults.headers.common['Authorization'] = `Bearer ${refreshToken}`
            
            axios.get("http://100.91.43.32:4000/token/refresh-token")
            .then(response => {
                localStorage.setItem('accessToken', response.data.accessToken)
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`

                axios.get("http://100.91.43.32:4000/user/get-user-info")
                .then(response => {
                    setUserPhoto(response.data.Photo)
                })
            })
        })
    }, [])

    // Change user's image request.
    useEffect(() => {
        if (!changeImage) {
            return 
        }

        const accessToken = localStorage.getItem('accessToken');
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

        axios.patch("http://100.91.43.32:4000/user/change-user-image", { image: changeImage })
        .then(response => {
            notify("Profile image with success!")
        })
        .catch(error => {
            const refreshToken = localStorage.getItem('refreshToken');
            axios.defaults.headers.common['Authorization'] = `Bearer ${refreshToken}`

            axios.get("http://100.91.43.32:4000/token/refresh-token")
            .then(response => {
                localStorage.setItem('accessToken', response.data.accessToken)
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`

                axios.patch("http://100.91.43.32:4000/user/change-user-image", { image: changeImage })
                .then(response => {
                    notify("Profile image with success!")
                })
            })
            .catch(error => {
                navigate("/", { replace: true })
            })
        })

    }, [changeImage])

	return(
		<div className="w-full">
			<div className="w-full flex flex-row justify-between">
				{(userPhoto) ? 
                    <div className="flex flex-row mx-10 mt-10 items-center">
                        <div className="relative">
                            <input  
                                type="file"
                                accept="image/*"
                                onChange={changeUserPhoto}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        
                            <div className="p-7">
                                <img src={userPhoto} className="text-5xl text-white w-32 h-32 rounded-full border-2 border-black-500" />
                            </div>
                        </div>   
                        <div className="flex flex-row justify-center items-center">
                                <h2 className="text-exo text-4xl text-white font-bold ml-10 select-none">
                                    {/* username */}
                                    {getUsernameFromToken()} 
                                </h2>
                            </div>
                    </div>
					:
					<div className="flex flex-row mx-10 mt-10 items-center">
                        <div className="relative w-32 h-32">
                            <input  
                                type="file"
                                accept="image/*"
                                onChange={changeUserPhoto}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            
                            <div className="bg-gradient-to-r from-purple-200 to-blue-200 flex justify-center items-center border-2 border-black-500 rounded-full w-32 h-32 p-7">
                                <FontAwesomeIcon icon={faUser} className="text-5xl text-white" />
                            </div>
                        </div>
                        
                        <div className="flex flex-row justify-center items-center">
                            <h2 className="text-exo text-4xl text-white font-bold ml-10 select-none">
                                {/* username */}
                                {getUsernameFromToken()} 
                            </h2>
                        </div>
					</div>
				}
                <div className="flex justify-center items-center mr-36">    
                    <button onClick={deleteAccount} className="rounded-md bg-red-200 hover:bg-red-300 px-4 py-2 mt-16"> Delete Account </button>
                </div>
            </div>   
            <form onSubmit={submitData} autoComplete="off" className="w-full flex flex-col justify-center items-center mt-4">
                <div className="flex flex-col w-3/4 mt-2">
                    <h1 className="font-bold font-exo text-white"> Email </h1>
                    <input 
                        type="text"
                        autoComplete="off"
                        placeholder={email}
                        onChange={changeEmail}
                        className="w-full h-12 rounded-sm border-2 border-gray-200 bg-transparent pl-3 mt-2 hover:border-2 hover:border-purple-300 text-white"
                    />
                </div>
                <div className="flex flex-row w-3/4 gap-8">
                    <div className="flex flex-col w-3/4 mt-8">
                        <h1 className="font-bold font-exo text-white"> New Password </h1>
                        <input 
                            autoComplete="off" 
                            type="password" 
                            onChange={changePassword}
                            className="bg-transparent rounded-sm border-2 border-gray-200 hover:border-purple-300 w-full h-12 text-white pl-3"
                        />
                    </div>
                    <div className="flex flex-col w-3/4 mt-8">
                        <div className="flex flex-row">    
                            <h1 className="font-bold font-exo text-white"> Old Password </h1>
                            <p className="text-white font-bold ml-3 text-red-300"> * </p>
                        </div>
                        <input 
                            autoComplete="off" 
                            onChange={changeOldPassword}
                            type="password" 
                            className="bg-transparent rounded-sm border-2 border-gray-200 hover:border-purple-300 w-full h-12 text-white pl-3"
                        />
                    </div>
                </div>
                <div className="flex flex-col w-3/4 mt-8">
                    <h1 className="font-bold font-exo text-white"> Country </h1>
                    <CountrySelection className="mt-2" country={country} setCountry={setCountry} />
                </div>
                <ErrorMessage error={error} />
                <button className="rounded-md bg-purple-200 hover:bg-purple-300 px-4 py-2 mt-4"> Change data </button>
            </form>
            <ToastContainer />
		</div>
	)
}

export default User