const fs = require('fs')
const JSONStream = require('JSONStream');
const helpers = require('./sql/helpers.js');

let stream = fs.createReadStream('./Artworks.json', {encoding: 'utf8'});
let parser = JSONStream.parse('*'); 

stream.pipe(parser);

let add_count = 0; 
let rej_count = 0; 

parser.on('data', async function(data) {
    try {
        let ver = await verifyArtwork(data); 

        if (ver) {
            // add the artwork to the SQL table
            await helpers.add_verified_artwork(data);

            console.log('adding artwork:', add_count);
            add_count++;
        } else {
            console.log('not adding artwork:', rej_count);
            rej_count++;
        }
    } catch (e) {
        console.log('an error occurred:', data);
    }
});

// verifies that the artwork data is clean
function verifyArtwork(obj) {
    return new Promise(async (resolve, reject) => {
        let verify = true; 

        verify = verify && obj.ConstituentID && obj.ConstituentID.length > 0; 

        verify = verify && (await helpers.verify_artist_exists(obj.ConstituentID[0]));

        verify = verify && obj.Title && obj.Date && obj.ObjectID 
            && obj.Cataloged === "Y" && obj.Classification; 

        resolve(verify);
    });
}