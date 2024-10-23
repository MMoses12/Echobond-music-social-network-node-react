// Basic imports.
import React, { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"

// Import axios for requests.
import axios from "axios"

// Import components.
import Navbar from "../components/HomePage/navbar.js"
import Background from "../Photos/background.jpg"
import Slider from "../components/HomePage/showSlider.js"
import Footer from "../components/HomePage/footer.js"

// Import icons.
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeadphones, faUsers, faMusic, faShareFromSquare } from '@fortawesome/free-solid-svg-icons'

// Import photos.
import OurMissionPhoto from "../Photos/OurMissionPhoto.jpg"
import OurStoryPhoto from "../Photos/OurStoryPhoto.jpg"
import MoysisPhoto from "../Photos/Moysis.png"
import KostasPhoto from "../Photos/Kostas.png"
import DimitrisPhoto from "../Photos/Dimitris1.png"

// Import creator CVs
import MoysisCV from "../Photos/Moysis Moysis CV.pdf"
import KostasCV from "../Photos/Konstantinos-Panagiotis_Kafantaris_CV.pdf"
import DimitrisCV from "../Photos/Dimitrios_Gavouras_CV_.pdf"

// Import custom css.
import "../styles/stripes.css"
import "../styles/scrollbar.css"

function HomePage () {
    const navigate = useNavigate()

    // Check token to go to musicHome immediately.
    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken")
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

        axios.get("http://100.91.43.32:4000/token/check-token")
        .then(response => {
            navigate("/musicHome", { replace: true })
        })
        .catch(error => {
            const refreshToken = localStorage.getItem("refreshToken")
            axios.defaults.headers.common['Authorization'] = `Bearer ${refreshToken}`

            axios.get("http://100.91.43.32:4000/token/refresh-token")
            .then(response => {
                localStorage.setItem('accessToken', response.data.accessToken)

                navigate("/musicHome", { replace: true })
            })
            .catch(error => {
                navigate("/")
            })
        })
    }, []);

    return (
        <div className="flex flex-col justify-between">
            <div className="flex flex-col relative min-h-screen bg-black-500 min-h-screen bg-cover bg-no-repeat" style={{ backgroundImage: `url(${Background})` }}>
                {/* Navbar component */}    
                <Navbar isLogged={false} />
                <div className="flex flex-row justify-between">
                    {/* Left space text. */}
                    <div>
                        <h1 className="text-white text-4xl font-bold mt-44 ml-12 font-exo mx-14">
                            Sync your beats, <br />
                            share the moment <br />
                        </h1>
                        <p className="text-sm text-purple-400 font-exo mt-5 ml-12 mx-14 "> 
                            Listen together, apart. With EchoBond, sync up your <br />
                            music life—turning every stream into a shared <br /> 
                            experience.
                        </p>
                    </div>
                    {/* Right space box. */}
                    <div className="border border-purple-100 rounded-xl overflow-hidden shadow-lg w-1/5 mt-44 mr-16">
                        <h1 className="text-center text-white font-nunito font-bold text-5xl pt-6 pb-6 bg-stripes select-none"> Mu𝅘𝅥𝅮ic </h1>
                        <h1 className="bg-black-300 pb-5 text-purple-400 pt-3 px-2 font-bold text-center font-nunito"> Join the EchoBond Community - Start Your Shared Playlist Today! </h1>
                        <p className="bg-black-300 text-purple-300 px-5 pt-3 font-nunito"> 
                            Listen to your favourite artists. <br />
                            For free, for ever <br />
                        </p>
                        {/* Music slider */}
                        <div className="bg-black-300 flex justify-center items-center pt-12 pb-4">
                            <Slider />
                        </div>
                    </div>
                </div>
            </div>
            <hr className="text-xl text-gray-500"/>
            {/* Feature Highlight */}
            <div className="bg-black-400 p-6">
                <h2 className="text-white text-3xl font-bold font-exo"> Features Highlight </h2>
                <div className="flex flex-row justify-between items-center gap-12 px-9 py-14">
                    <div className="flex flex-col items-center justify-center">
                        <div className="bg-gradient-to-br from-purple-500 via-black-300 to-blue-400 m-3 rounded-full w-36 h-36 shadow-lg flex justify-center items-center"> 
                            <FontAwesomeIcon icon={faHeadphones} className="text-purple-200 text-5xl" />
                        </div>
                        <h1 className="text-2xl text-white font-bold font-nunito pb-3"> Synced Playback </h1>
                        <p className="text-sm text-white font-nunito text-center"> 
                            Enjoy songs simultaneously with friends <br />
                            and family no matter where they are 
                        </p>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <div className="bg-gradient-to-br from-purple-500 via-black-300 to-blue-400 m-3 rounded-full w-36 h-36 shadow-lg flex justify-center items-center"> 
                            <FontAwesomeIcon icon={faMusic} className="text-purple-200 text-5xl" />
                        </div>
                        <h1 className="text-2xl text-white font-bold font-nunito pb-3"> Curated Playlists </h1>
                        <p className="text-sm text-white font-nunito text-center"> 
                            Discover new music together with playlists <br />
                            curated by mood, genre, and activity
                        </p>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <div className="bg-gradient-to-br from-purple-500 via-black-300 to-blue-400 m-3 rounded-full w-36 h-36 shadow-lg flex justify-center items-center"> 
                            <FontAwesomeIcon icon={faUsers} className="text-purple-200 text-5xl" />
                        </div>
                        <h1 className="text-2xl text-white font-bold font-nunito pb-3"> Personalized Rooms </h1>
                        <p className="text-sm text-white font-nunito text-center"> 
                            Create your own room, invite your <br />
                            circle and bond over beats
                        </p>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <div className="bg-gradient-to-br from-purple-500 via-black-300 to-blue-400 m-3 rounded-full w-36 h-36 shadow-lg flex justify-center items-center"> 
                            <FontAwesomeIcon icon={faShareFromSquare} className="text-purple-200 text-5xl" />
                        </div>
                        <h1 className="text-2xl text-white font-bold font-nunito pb-3"> Seamless Sharing </h1>
                        <p className="text-sm text-white font-nunito text-center"> 
                            Share your music moments with your <br />
                            people
                        </p>
                    </div>
                </div>
            </div>
            {/* About Us */}
            <div className="flex flex-col flex-wrap bg-black-400 p-6">
                <h2 className="text-white text-3xl font-bold font-exo"> About Us </h2>
                <h3 className="text-white text-xl font-bold font-nunito underline pt-10 pl-3"> Our mission </h3>
                <div className="flex flex-row justify-between pt-4 pl-3 pr-16">
                    <p className="text-white font-exo italic">
                        At EchoBond, we believe music is more than just a listening experience; it's a thread that connects souls and <br />
                        amplifies emotions across any distance. Our platform is the heartbeat of this belief, an innovative space where  <br />
                        friends and families sync up their music in real-time, creating a symphony of shared experiences. With <br /> 
                        cutting-edge technology, EchoBond transforms the way you listen to music into an interactive journey, weaving  <br />
                        individual streams into a tapestry of communal harmony. Whether it’s grooving to the latest hits or revisiting <br /> 
                        classics, every note on EchoBond is a chance to bring people together, making every beat a bond and every song <br /> 
                        a story written together.
                    </p>
                    <img src={OurMissionPhoto} className="ml-48 w-64 h-64 rounded-xl select-none relative -left-10 -top-10" />
                </div>
                <h3 className="text-end text-white text-xl font-bold font-nunito underline pt-16 pr-16"> Our story </h3>
                <div className="flex flex-row-reverse justify-bewtween pt-4 pr-16">
                    <p className="text-white text-right font-exo italic">
                        It all began within the lively halls of the University of Thessaly, where three undergraduates united by their passion for music and <br/> 
                        technology embarked on a project for a course that soon blossomed into EchoBond. What started as a concept for a Spotify clone <br />
                        morphed into a quest to reimagine the music listening experience. We dreamed of a digital space where distance fades into the <br />
                        background, and shared melodies take center stage. EchoBond is our answer to the simple question: "What if friends could sync <br />
                        their playlists no matter where they are?" It’s more than an app; it’s a community, a shared beat, a way to stay connected with <br />
                        every note. And thus, our university project transformed into a symphony of shared experiences, where users don't just listen to <br />
                        music, they feel it together.
                    </p>
                    <img src={OurStoryPhoto} className="mr-48 ml-3 w-64 h-64 rounded-full select-none relative -top-16" />
                </div>
            </div>
            <hr className="h-1 border border-gray-500" />
            {/* Our Team */}
            <h2 className="text-white bg-black-400 text-3xl font-bold font-exo p-6"> Our team </h2>
            <div className="flex flex-row justify-center bg-black-400 gap-14 pb-8">
            <div  className="flex flex-col bg-black-400 justify-center items-center">
                    <Link to="/cv" state={{ CV: KostasCV }}>
                        <img src={KostasPhoto} className="w-52 h-52 rounded-full select-none" />
                    </Link>
                    <Link to="/cv" state={{ CV: KostasCV }}>   
                        <h2 className="text-lg text-white text-nunito font-bold cursor-pointer hover:text-purple-200 pt-2"> Kafantaris Konstantinos </h2>
                    </Link>
                    <p className="text-md text-white text-nunito"> Web Developer </p>
                </div> 
                <div  className="flex flex-col bg-black-400 justify-center items-center">
                    <Link to="/cv" state={{ CV: MoysisCV }}>
                        <img src={MoysisPhoto} className="w-52 h-52 rounded-full select-none" />
                    </Link>
                    <Link to="/cv" state={{ CV: MoysisCV }}>   
                        <h2 className="text-lg text-white text-nunito font-bold cursor-pointer hover:text-purple-200 pt-2"> Moysis Moysis </h2>
                    </Link>
                    <p className="text-md text-white text-nunito"> Software Engineer </p>
                </div>
                <div className="flex flex-col bg-black-400 justify-center items-center">
                    <Link to="/cv" state={{ CV: DimitrisCV }}>
                        <img src={DimitrisPhoto} className="w-52 h-52 rounded-full select-none" />
                    </Link>
                    <Link to="/cv" state={{ CV: DimitrisCV }}>   
                        <h2 className="text-lg text-white text-nunito font-bold cursor-pointer hover:text-purple-200 pt-2"> Gavouras Dimitrios </h2>
                    </Link>
                    <p className="text-md text-white text-nunito"> Software Engineer </p>
                </div>
            </div>
            {/* Footer */}
            <div>
                <Footer />
            </div>
        </div>
    );
}

export default HomePage