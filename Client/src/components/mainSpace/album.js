// Basic imports.
import React,{useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";

// Import axios for requests.
import axios from "axios";

// React spinner.
import { ClipLoader } from 'react-spinners'

// Component import.
import Album from "../albumComponent/albumComponent";

// Style import.
import "./album.css"

function Albums  (props){
    const[allAlbums,setAllAlbums] = useState([]);   
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate()

    // Get all albums' data request.
    useEffect(() => {
        // Fetch albums data when the component mounts
        axios.get("http://localhost:4000/albums/get-all-albums")
        .then(response => {
            setAllAlbums(response.data); // Assuming the response contains an array of albums
            setIsLoading(false);

        })
        .catch (error => {
            const refreshToken = localStorage.getItem('refreshToken');
            axios.defaults.headers.common['Authorization'] = `Bearer ${refreshToken}`

            axios.get("http://localhost:4000/token/refresh-token")
            .then(response => {       
                localStorage.setItem('accessToken', response.data.accessToken);
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`

                axios.get("http://localhost:4000/albums/get-all-albums")
                .then(response => {
                    setAllAlbums(response.data); // Assuming the response contains an array of albums
                    setIsLoading(false);
                })
            })
            .catch(error => {
                navigate("/", { replace: true })
            })
        })
    }, [])
    
    // Handle album click and send user
    // to album's page.
    const handleAlbumClick = (album) => {
        props.setSelectedAlbum(album); // Set selected album
        console.log(album)
        props.setChoice("AlbumSongs");
    };

    return(
            <div className="text-white flex flex-row flex-wrap justify-center gap-16 overflow-y-auto h-full">
                {isLoading ? (
                    <div className="flex justify-center items-center w-full h-full">
                        <ClipLoader color="purple" size={150} /> {/* Spinner component */}
                    </div>
                ) : allAlbums.length > 0 ? (
                allAlbums.map((album, index) => (
                    <div key={album} onClick={() => handleAlbumClick(album)}>
                        <Album 
                            image={album.image}
                            artist={album.artist}
                            name={album.name}
                            genre={album.style}
                            year={album.year}
                        />
                    </div>
                ))
                ) : (
                    <p>No albums found</p>
                )}
            </div>
    )
}

export default Albums;