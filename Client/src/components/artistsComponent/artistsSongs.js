// Basic imports.
import React,{useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";

// Import axios for requests.
import axios from "axios";

// Import icons.
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Component imports.
import Songs from '../albumComponent/song';
import Albums from '../albumComponent/albumComponent'

function ArtistsSongs (props){
	const [isFavorite, setIsFavorite] = useState(false)
	const [artistAlbum, setArtitsAlbum] = useState([])
	const [song, setSong] = useState([])
    const [tracks, setTracks] = useState()
    
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

	useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

        // Fetch albums data when the component mounts
        axios.get("http://localhost:4000/artists/get-artists-songs?name=" + props.name)
        .then(response => {
            setSong(response.data.songs); // Assuming the response contains an array of albums
            setArtitsAlbum(response.data.albums)// Assuming the response contains
            setIsFavorite(response.data.isFavorite);
			setIsLoading(false);
        })
        .catch (error => {
            const refreshToken = localStorage.getItem('refreshToken');
            axios.defaults.headers.common['Authorization'] = `Bearer ${refreshToken}`

            axios.get("http://localhost:4000/token/refresh-token")
            .then(response => {       
                localStorage.setItem('accessToken', response.data.accessToken);
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`

                axios.get("http://localhost:4000/albums/get-album-songs?name=" + props.name)
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


	const handleAlbumClick = (album) => {
		props.setSelectedAlbum(album); // Set selected album
		props.setChoice("AlbumSongs");
	};

	//handle back artist button
	const goToArtists =()=>{
		if(props) {
			props.setChoice("Artists");
		}
	}

    const setFavoriteArtist = ()=>{
        if(!isFavorite) {
			setIsFavorite(true);
            axios.put("http://localhost:4000/user/add-favourite-artist", { name: props.name })
            .then(response => {
                console.log("Success:", response.data);
            })
            .catch(error => {
                const refreshToken = localStorage.getItem('refreshToken');
                axios.defaults.headers.common['Authorization'] = `Bearer ${refreshToken}`

                axios.get("http://localhost:4000/token/refresh-token")
                .then(response => {       
                    localStorage.setItem('accessToken', response.data.accessToken);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`

                    setIsFavorite(true);
                    axios.put("http://localhost:4000/user/add-favourite-artist", { name: props.name })
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
            axios.delete("http://localhost:4000/user/remove-favourite-artist?name=" + props.name)
            .then(response => {
                console.log("Success:", response.data);
            })
            .catch(error => {
                const refreshToken = localStorage.getItem('refreshToken');
                axios.defaults.headers.common['Authorization'] = `Bearer ${refreshToken}`

                axios.get("http://localhost:4000/token/refresh-token")
                .then(response => {       
                    localStorage.setItem('accessToken', response.data.accessToken);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`
                
                    setIsFavorite(false);
                    axios.delete("http://localhost:4000/user/remove-favourite-artist?name=" + props.name)
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
		<div className ="flex flex-col h-full overflow-y-auto select-none">
			<div className="text-white text-3xl ml-10 cursor-pointer">
				<FontAwesomeIcon icon={faArrowLeft} onClick={goToArtists}/>
			</div> 
			<div className="flex flex-row w-5/6 mx-auto">
				<img src={props.image} className="h-52 w-52 rounded-full "/>
				<div className="flex flex-col mt-20">
					<div>
						<h5 className="ml-6 text-white card-title">Artist</h5>
					</div>
					<div className="text-white font-exo text-6xl ml-8">
						{props.name}
						{props.style}
					</div>
					<div className="ml-6 flex flex-row gap-4 text-white card-title">
						<div className="flex flex-row gap-2 ">    
							<h5>{song.length} </h5>
							<h5>Songs</h5>
							<p>●</p>

						</div>
						<div className="flex flex-row gap-2 ">
							<h5>{artistAlbum.length}</h5>
							<h5>Albums</h5>
							<p>●</p>
							<div className="">
                            	<i className={`${isFavorite ? 'fas text-white' : 'far text-white'} fa-heart cursor-pointer`} onClick={() => setFavoriteArtist()}/>
                        	</div>
						</div>
					</div>
				</div>
			</div>
			<div className="flex flex-col select-none ">
				<div className="font-exo text-2xl text-white ml-16 mt-10">
					Artist's most heard
				</div>
				<div className="flex flex-row flex-wrap text-white gap-4 overflow-x-auto items-center mt-8 ml-12">
					{song.map((song, index) => (
						<div key={index} className="text-white">
                        <Songs
                            name={song.title}
                            time ={song.time}
                            image={song.image}
                            artist={song.artist}
                            />
						</div>
					))}
				</div>
				<div className="font-exo text-2xl text-white ml-16 mt-10">
					Artist's Albums
				</div>
				<div className="flex flex-row flex-wrap text-white gap-16 overflow-x-auto items-center mt-8 ml-12 mb-14">
					{artistAlbum.map((album,index) => (
						<div key={index} className="" onClick={() => handleAlbumClick(album)}>
							<Albums 
								image = {album.image}
								name = {album.name}
                                year = {album.year}
                                genre = {album.style}
                                artist = {album.artist}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default ArtistsSongs;