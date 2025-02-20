// Basic imports.
import React, { useState, useEffect } from "react";

// Import axios for requests.
import axios from "axios";

// Component imports.
import Album  from '../albumComponent/albumComponent'
import Artists from "../artistsComponent/artistsComponent";
import Songs from "../albumComponent/song"

function SearchIdle (props) {
    const [AllRecentSongs, setAllRecentSongs] = useState([]);

    const [AllRecentArtists, setAllRecentArtists] = useState([]);

    const [AllRecentAlbum,setAllRecentAlbum] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    // Put recent searched.
    useEffect(() =>{
        const accessToken = localStorage.getItem('accessToken');
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

        // Fetch albums data when the component mounts
        axios.get("http://localhost:4000/user/search-recent")
        .then(response => {
            setAllRecentSongs(response.data.songs); // Assuming the response contains an array of albums
            setAllRecentAlbum(response.data.albums)// Assuming the response contains
            setAllRecentArtists(response.data.artists);
            console.log(AllRecentAlbum)
            console.log(AllRecentArtists)
			setIsLoading(false);
        })
        .catch (error => {
            const refreshToken = localStorage.getItem('refreshToken');
            axios.defaults.headers.common['Authorization'] = `Bearer ${refreshToken}`

            axios.get("http://localhost:4000/token/refresh-token")
            .then(response => {       
                localStorage.setItem('accessToken', response.data.accessToken);
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`
                

                axios.get("http://localhost:4000/user/search-recent")
                .then(response => {
                    setAllRecentSongs(response.data.songs); // Assuming the response contains an array of albums
                    setAllRecentAlbum(response.data.albums)// Assuming the response contains
                    setAllRecentArtists(response.data.artists);
                    console.log(AllRecentAlbum)
                    console.log(AllRecentArtists)
                    setIsLoading(false);
                })
            })
        })
    },[])

    //handle the click of the Artist
    const handleArtistClick = (artist) => {
        //setting the page to mainSpace and putting ArtistSongs
        props.setSelectedArtist(artist);
        props.setMainSpace("mainSpace")
        props.setChangeTo("ArtistsSongs");
    }

    //handle the click of the Album
    const handleAlbumClick = (album) => {
        props.setSelectedAlbum(album);
        //setting the page to mainSpace and putting AlbumSongs
        props.setMainSpace("mainSpace")
        props.setChangeTo("AlbumSongs");
    }

    return (
        <div className="flex flex-col h-full">
            <div className="text-white mb-4 mt-4 ml-24 text-xl">
            <p className="font-bold">Recently Searched</p>
            </div>
            <div className="flex-wrap overflow-y-auto h-5/6 mb-24">
                <div className="flex flex-col flex-wrap text-white gap-4 overflow-x-auto ml-20 mt-4">
                    <div className="flex flex-row flex-wrap overflow-x">
                        {AllRecentArtists.map((artist, index) => (
                                <div key={index} className="text-white" onClick={() => handleArtistClick(artist)}>
                                    <Artists 
                                        image = {artist.image}
                                        name = {artist.name}
                                        music = {artist.style}
                                    />
                                </div>
                            ))}
                            {AllRecentAlbum.map((album,index) => (
                                <div key={index} className="" onClick={() => handleAlbumClick(album)}>
                                    <Album 
                                        image = {album.image}
                                        artist = {album.artist}
                                        name = {album.name}
                                        genre ={album.style}
                                        year = {album.year}
                                    />
                                </div>
                            ))}
                        </div>
                    <div>
                        {AllRecentSongs.map((song, index) => (
                            <div key={index} className="text-white">
                                <Songs 
                                    image = {song.image}
                                    name = {song.title}
                                    artist = {song.artist}
                                    time = {song.time}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchIdle;