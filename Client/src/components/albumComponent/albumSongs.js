// Basic imports.
import React,{ useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Import axios for requests.
import axios from "axios";

// Import icons.
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Component imports.
import Song from "./song";

    
function AlbumSongs (props) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [tracks, setTracks] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

        // Fetch albums data when the component mounts
        axios.get("http://100.91.43.32:4000/albums/get-album-songs?name=" + props.name)
        .then(response => {
            setTracks(response.data.albums); // Assuming the response contains an array of albums
            setIsFavorite(response.data.isFavorite); // Assuming the response contains
            setIsLoading(false);
        })    
        .catch (error => {           
            const refreshToken = localStorage.getItem('refreshToken');
            axios.defaults.headers.common['Authorization'] = `Bearer ${refreshToken}`

            axios.get("http://100.91.43.32:4000/token/refresh-token")
            .then(response => {       
                localStorage.setItem('accessToken', response.data.accessToken);
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`

                axios.get("http://100.91.43.32:4000/albums/get-album-songs?name=" + props.name)
                .then(response => {
                    setTracks(response.data.albums); // Assuming the response contains an array of albums
                    setIsFavorite(response.data.isFavorite); // Assuming the response contains
                    setIsLoading(false);
                })    
            })
            .catch(error => {
                navigate("/", { replace: true })
            })
        })
    }, [])

    const getTotalDuration = () => {
        let totalSeconds = 0;
        tracks.forEach(track => {
            const [minutes, seconds] = track.time.split(":").map(Number);
            totalSeconds += minutes * 60 + seconds;
        });
        const totalMinutes = Math.floor(totalSeconds / 60);
        const remainingSeconds = totalSeconds % 60;
        return `${totalMinutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };
    
    //handle button back click
    const goToAlbums =()=>{
		if(props)
		props.setChoice("Albums");
	}


    const setFavoriteAlbum = ()=>{
        if(!isFavorite) {
            setIsFavorite(true);

            const accessToken = localStorage.getItem('accessToken');
            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

            axios.put("http://100.91.43.32:4000/user/add-favourite-album", { name: props.name })
            .then(response => {
                console.log("Success:", response.data);
                
            })
            .catch(error => { 
                const refreshToken = localStorage.getItem('refreshToken');
                axios.defaults.headers.common['Authorization'] = `Bearer ${refreshToken}`

                axios.get("http://100.91.43.32:4000/token/refresh-token")
                .then(response => {
                    localStorage.setItem('accessToken', response.data.accessToken)
                    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`

                    axios.put("http://100.91.43.32:4000/user/add-favourite-album", { name: props.name })
                    .then(response => {
                        console.log("Success:", response.data);
                        
                    })
                })
                .catch(error => {
                    navigate("/", { replace: true })
                })
            });

        }
        else{
            setIsFavorite(false);

            const accessToken = localStorage.getItem('accessToken');
            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

            axios.delete("http://100.91.43.32:4000/user/remove-favourite-album?name=" + props.name)
            .then(response => {
                console.log("Success:", response.data);
                
            })
            .catch(error => { 
                const refreshToken = localStorage.getItem('refreshToken');
                axios.defaults.headers.common['Authorization'] = `Bearer ${refreshToken}`

                axios.get("http://100.91.43.32:4000/token/refresh-token")
                .then(response => {
                    localStorage.setItem('accessToken', response.data.accessToken)
                    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`

                    axios.delete("http://100.91.43.32:4000/user/remove-favourite-album?name=" + props.name)
                    .then(response => {
                        console.log("Success:", response.data);
                        
                    })
                })
                .catch(error => {
                    navigate("/", { replace: true })
                })
            });
        }
    }

    return (
        <div className ="flex flex-col h-full overflow-y-auto">
            <div className="text-white text-3xl ml-10 cursor-pointer">
                <FontAwesomeIcon icon={faArrowLeft} onClick={goToAlbums} />
            </div> 
            <div className="flex flex-row w-5/6 mx-auto">
                <img src={props.image} className="h-64 w-2/5 rounded-2xl"/>
                <div className="flex flex-col mt-20">
                    <div className="mb-2">
                        <h5 className="ml-6 text-white card-title">Album</h5>
                    </div>
                    <div className="text-white font-exo font-bold text-6xl ml-6 mb-1">
                        {props.name}
                    </div>
                    <div className="ml-6 flex flex-row text-gray-200 gap-2  font-exo text-l">
                        <div>
                            <p>Songs {tracks.length}</p>
                        </div>
                        <div>
                            ● 
                        </div>
                        <div>
                            Total Duration {getTotalDuration()} ●
                        </div>
                        <div className="">
                            <i className={`${isFavorite ? 'fas text-white' : 'far text-white'} fa-heart cursor-pointer`} onClick={() => setFavoriteAlbum()}/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-8 w-5/6 mx-auto flex flex-col gap-8 cursor-pointer mb-14">
                {tracks.map((track ) => (
                    <div key={track}>
                        <Song 
                            name={track.title}
                            time ={track.time}
                            image={track.image}
                            artist={track.artist}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AlbumSongs;