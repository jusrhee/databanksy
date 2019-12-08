const fs = require('fs')
const JSONStream = require('JSONStream');
const helpers = require('./sql/helpers.js');
const request = require('request');

let rows = [];

let requestMomaArtists = () => {
    let stream = fs.createReadStream('./data/Artists.json', {encoding: 'utf8'});
    let parser = JSONStream.parse('*'); 

    stream.pipe(parser);

    let add_count = 0; 
    let rej_count = 0; 

    parser.on('data', async function(obj) {
        try {
            let ver = await verifyArtist(obj); 
            
            obj.DataSource = "MOMA";

            if (ver) {
                // add the artist to the SQL table
                let names = obj.DisplayName.split(" ");
                let first = names[0];
                let last = names[names.length - 1];

                obj.ulan_ID = await helpers.find_ulan_artist(first, last);   

                await helpers.add_verified_moma_artist(obj);

                console.log('adding moma artist:', add_count);
                add_count++;
            } else {
                console.log('not adding moma artist:', rej_count);
                rej_count++;
            }
        } catch (e) {
            console.log('an error occurred:', data);
        }
    });
}

// verifies that the artist data is clean
function verifyArtist(obj) {
    return new Promise(async (resolve, reject) => {
        let verify = true; 

        verify = verify && obj.ConstituentID && obj.DisplayName; 

        // check if the artist exists or not
        let exists = await helpers.verify_moma_artist_exists(obj.ConstituentID); 

        if (exists) {
            resolve(false);
        } else {
            resolve(verify);
        }
    });
}

requestMomaArtists(); 