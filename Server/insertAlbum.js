import sharp from 'sharp';
import fs from 'fs'
import client from './config/database.js';

// IMPORT ALBUMS
try{
    await client.connect()
    const file = fs.readFileSync('./Photos/nixtes.png')

    const processedImage = await sharp(file)
    .resize(100, 100) // Resize to 100x100 pixels
    .jpeg({ quality: 90 }) // Convert to JPEG with 80% quality
    .toBuffer(); // Convert to a buffer for insertion


    await client.connect()
    const albums = client.db("EchoBond").collection("Albums")
    await albums.insertOne({name:"Alkoolikes I Nihtes",artist:"Pantelis Pantelidis",year:"2012",style:"Laika",image:processedImage})
}
catch (error){
    console.log(error)
}

// -------------------------------------------------------------------------------------------------------------------------
// Check all albums.

try {
    await client.connect()

    const songsCollection = client.db("EchoBond").collection("Albums");

    // Fetch all documents
    const albums = await songsCollection.find({}, 
        {projection: { name: 1 }}
    ).toArray();

    // Log the documents
    albums.map((album) => {
        console.log(album.name);
    })
} catch (error) {

}