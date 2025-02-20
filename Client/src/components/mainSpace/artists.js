// Basic imports.
import React,{useState,useEffect} from "react";

// Import axios for requests.
import axios from "axios";

// React spinner.
import { ClipLoader } from 'react-spinners'

// Component import.
import ArtistComp from "../artistsComponent/artistsComponent";

function Artists(props) {
    const [allArtists,setAllArtists] = useState([]);   
    const [isLoading, setIsLoading] = useState(true)

    const [error, setError] = useState()

    // Fetch all artists' data.
    useEffect(() => {
        // Fetch artists data when the component mounts
        fetchArtists();
    }, []); // Empty dependency array means this effect runs only once after initial render
    
    const fetchArtists = async () => {
        try{
            const accessToken = localStorage.getItem('accessToken');
            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

            const response = await axios.get("http://localhost:4000/artists/get-all-artists")
            setAllArtists(response.data); //assuming the response contains an array of data
            setIsLoading(false);
        }
        catch(error){
            console.error("Error fetching artists:", error);
            setError('Failed to fetch artists');
            setIsLoading(false);
        }

    }

    // Go to a specific artist's page.
    const handleArtistClick = (artist) => {
       props.setSelectedArtist(artist);
        props.setChoice("ArtistsSongs");
    };
    
    return (
        <div className="flex flex-col overflow-x-auto h-5/6 select-none">
            <div className="text-white mb-4 text-center">
                <p className="font-bold">Artists by Music Genre</p>
                <p className="text-gray">Explore artists by the kind of music they support</p>
            </div>
            <div className="text-white flex flex-row justify-center flex-wrap gap-20 overflow-y-auto h-full">
            {isLoading ? (
                    <div className="flex justify-center items-center w-full h-full">
                        <ClipLoader color="purple" size={150} /> {/* Spinner component */}
                    </div>
                ) : allArtists.length > 0 ? (
                allArtists.map((artist, index) => (
                    <div key={artist} className="" onClick={() => handleArtistClick(artist)}>
                        <ArtistComp 
                            image={artist.image}
                            name={artist.name}
                            music={artist.style}
                        />
                    </div>
                ))
                ) : (
                    <p>No artists found</p>
                )}
            </div>
        </div>
    
);

}

export default Artists;
