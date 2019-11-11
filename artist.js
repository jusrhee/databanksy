const fs = require('fs')
const JSONStream = require('JSONStream');
const helpers = require('./sql/helpers.js');

let stream = fs.createReadStream('./Artists.json', {encoding: 'utf8'});
let parser = JSONStream.parse('*'); 

stream.pipe(parser);

let add_count = 0; 
let rej_count = 0; 

parser.on('data', async function(data) {
    try {
        let ver = await verifyArtist(data); 

        if (ver) {
            // add the artist to the SQL table
            await helpers.add_verified_artist(data);

            console.log('adding artist:', add_count);
            add_count++;
        } else {
            console.log('not adding artist:', rej_count);
            rej_count++;
        }
    } catch (e) {
        console.log('an error occurred:', data);
    }
});

// verifies that the artist data is clean
function verifyArtist(obj) {
    return new Promise((resolve, reject) => {
        let verify = true; 

        verify = verify && obj.ConstituentID && obj.DisplayName
            && obj.ArtistBio && obj.Nationality && obj.BeginDate; 

        verify = verify && (obj.EndDate || obj.EndDate === 0); 

        resolve(verify);
    });
}