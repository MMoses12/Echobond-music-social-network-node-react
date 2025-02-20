// Basic import.
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Import axios for requests.
import axios from "axios";

// Component imports.
import Song from "../albumComponent/song";
import Album from "../albumComponent/albumComponent";
import Artists from "../artistsComponent/artistsComponent";

function SearchHandler (props) {
    const[tracks,setTracks] = useState([])
    const[albums,setAlbums] = useState([])
    const[artists,setArtists] = useState([])

    const navigate = useNavigate()

    // Search songs, artists and albums request.
    useEffect(() =>{
        axios.get('http://localhost:4000/search/get-search?value='+props.value)
        .then(response=>{
            setTracks(response.data.songs)
            setArtists(response.data.artists)
            setAlbums(response.data.albums)
        })
        .catch(error => {
            const refreshToken = localStorage.getItem('refreshToken');
            axios.defaults.headers.common['Authorization'] = `Bearer ${refreshToken}`

            axios.get("http://localhost:4000/token/refresh-token")
            .then(response => {       
                localStorage.setItem('accessToken', response.data.accessToken);
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`
                

                axios.get('http://localhost:4000/search/get-search?value='+props.value)
                .then(response=>{
                    setTracks(response.data.songs)
                    setArtists(response.data.artists)
                    setAlbums(response.data.albums)
                })
            })
            .catch(error => {
                navigate("/", { replace: true })
            })
        })
    },[props.trigger])

    //handle the click of the Artist
    const handleArtistClick = (artist) => {
        //setting the page to mainSpace and putting ArtistSongs
        props.setSelectedArtist(artist);
        props.setMainSpace("mainSpace")
        props.setChangeTo("ArtistsSongs");


        axios.put("http://localhost:4000/search/search-items",{name : artist.name , type:"artist"})
        .catch(error => {
            const refreshToken = localStorage.getItem('refreshToken');
            axios.defaults.headers.common['Authorization'] = `Bearer ${refreshToken}`

            axios.get("http://localhost:4000/token/refresh-token")
            .then(response => {       
                localStorage.setItem('accessToken', response.data.accessToken);
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`
                
                axios.put("http://localhost:4000/search/search-items",{name : artist.name , type:"artist"})
            })
        })
    }

    //handle the click of the Song
    const handleSongClick = (song) => {
        axios.put("http://localhost:4000/search/search-items",{name:song.title , type:"song"})
        .catch(error => {
            const refreshToken = localStorage.getItem('refreshToken');
            axios.defaults.headers.common['Authorization'] = `Bearer ${refreshToken}`

            axios.get("http://localhost:4000/token/refresh-token")
            .then(response => {       
                localStorage.setItem('accessToken', response.data.accessToken);
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`
                
                axios.put("http://localhost:4000/search/search-items",{name:song.title , type:"song"})
            })
        })
    }

        //handle the click of the Album
        const handleAlbumClick = (album) => {
            props.setSelectedAlbum(album);
            //setting the page to mainSpace and putting AlbumSongs
            props.setMainSpace("mainSpace")
            props.setChangeTo("AlbumSongs");
    
            axios.put("http://localhost:4000/search/search-items",{name : album.name , type:"album"})
            .catch(error => {
                const refreshToken = localStorage.getItem('refreshToken');
                axios.defaults.headers.common['Authorization'] = `Bearer ${refreshToken}`

                axios.get("http://localhost:4000/token/refresh-token")
                .then(response => {       
                    localStorage.setItem('accessToken', response.data.accessToken);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`
                    

                    axios.put("http://localhost:4000/search/search-items",{name : album.name , type:"album"})
                })
            })
        }
    
    return (
        <div className="flex flex-col h-full">
            <div className="text-white mb-4 mt-4 ml-24 text-2xl">
                <p className="font-bold">Your Results :</p>
            </div>
            <div className="flex-wrap overflow-y-auto mb-24"> 
                <div className="flex flex-col flex-wrap text-white gap-4 ml-16 mt-4">
                    {tracks.map((track) => (
                        <div key={track} onClick={() => handleSongClick(track)}>
                            <Song 
                                name={track.title}
                                time ={track.time}
                                image={track.image}
                                artist={track.artist}
                            />
                        </div>
                    ))}
                </div>
                <div className="flex flex-row flex-wrap overflow-x">
                    <div className="flex flex-row flex-wrap text-white gap-4 overflow-x-auto ml-16 mt-4">
                        {albums.map((album ) => (
                            <div key={album} onClick={() => handleAlbumClick(album)}>
                                <Album 
                                    name = {album.name}
                                    genre = {album.style}
                                    image = {album.image}
                                    year = {album.year}
                                    artist = {album.artist}
                                    />
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-row flex-wrap text-white gap-4 overflow-x-auto mt-4">
                        {artists.map((artist ) => (
                            <div key={artist} onClick={() => handleArtistClick(artist)}>
                                <Artists 
                                    name={artist.name}
                                    image={artist.image}
                                    music={artist.style}
                                    />
                            </div>
                        ))}
                    </div>
                </div> 
            </div>
        </div>
    )
}

export default SearchHandler