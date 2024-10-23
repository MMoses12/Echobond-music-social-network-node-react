import sharp from 'sharp';
import fs from 'fs'
import client from './config/database.js';

// IMPORT SONGS.
// try{
//     await client.connect()

//     const file = fs.readFileSync('./Photos/Roza.png')

//     const processedImage = await sharp(file)
//     .resize(100, 100) // Resize to 50x50 pixels
//     .jpeg({ quality: 90 }) // Convert to JPEG with 90% quality
//     .toBuffer(); // Convert to a buffer for insertion

//     const song = fs.readFileSync("./Photos/Roza.mp3")
//     const processedSong = Buffer.from(song)

//     // console.log(processedSong)
    
//     await client.connect()
//     const songs = client.db("EchoBond").collection("Songs")
//     await songs.insertOne({title:"Roza", artist:"Dimitris Mitropanos", album: "I Ethniki Mas Monaxia", time:"4:36" ,image:processedImage, data:processedSong})

//     console.log("Inserted")
// }
// catch (error){
//     console.log(error)
// }

// -------------------------------------------------------------------------------------------------------------------------
// Check all songs.

try {
    await client.connect()

    const songsCollection = client.db("EchoBond").collection("Songs");

    // Fetch all documents
    const songs = await songsCollection.find({}, 
        {projection: { title: 1, artist: 1, album: 1 }}
    ).toArray();

    // Log the documents
    songs.map((song) => {
        console.log(song.title, song.artist, song.album);
    })
} catch (error) {

}