import sharp from 'sharp';
import fs from 'fs'
import client from './config/database.js';

// IMPORT ARTISTS
try{
    await client.connect()
    const file = fs.readFileSync('./Photos/image.png')

    const processedImage1 = await sharp(file)
    .resize(100, 100) // Resize to 100x100 pixels
    .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
    .toBuffer(); // Convert to a buffer for insertion

    const albums = client.db("EchoBond").collection("Artists")
    await albums.insertOne({name:"Pantelis Pantelidis", style:"Laika", image:processedImage1})
}
catch (error){
    console.log(error)
}

// -------------------------------------------------------------------------------------------------------------------------
// Check all artists.

try {
    await client.connect()

    const songsCollection = client.db("EchoBond").collection("Artists");

    // Fetch all documents
    const artists = await songsCollection.find({}, 
        {projection: { name: 1}}
    ).toArray();

    // Log the documents
    artists.map((artist) => {
        console.log(artist.name);
    })
} catch (error) {

}