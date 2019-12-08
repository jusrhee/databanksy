const fs = require('fs')
const JSONStream = require('JSONStream');
const helpers = require('./sql/helpers.js');
const request = require('request');

let requestMomaArtworks = () => {
    let stream = fs.createReadStream('./data/Artworks.json', {encoding: 'utf8'});
    let parser = JSONStream.parse('*'); 

    stream.pipe(parser);

    let add_count = 0; 
    let rej_count = 0; 

    parser.on('data', async function(data) {
        try {
            let ver = await verifyArtwork(data);
            data.image = data.ThumbnailURL;
            data.DataSource = "MOMA";

            if (ver) {
                // add the artwork to the SQL table
                await helpers.add_verified_artwork(data);

                console.log('adding artwork:', add_count);
                add_count++;
            } else {
                rej_count++;
                console.log('not adding artwork:', rej_count);
            }
        } catch (e) {
            console.log('an error occurred:', data);
        }
    });
}

let requestArtsyArtworks = (artist_id, url, token) => {
    const options = {
      url: url || "https://api.artsy.net/api/artworks",
      headers: {
        'X-XAPP-Token': token
      }
    };

    if (artist_id && !url) {
        options.qs = {
            artist_id: artist_id
        };
    }

    let add_count = 0; 
    let rej_count = 0; 

    request(options, async function (err, response, body) {
        if (err) console.error('error:', error); 

        res = JSON.parse(body); 

        // insert res into database 
        if (res._embedded && res._embedded.artworks && res._embedded.artworks.length > 0) {
            for (let artwork of res._embedded.artworks) {
                let obj = {}; 

                obj.ConstituentID = [ artist_id ];
                obj.object_id = artwork.id;
                obj.Title = artwork.title;
                obj.Date = artwork.date;
                obj.Cataloged = "Y";
                obj.Classification = artwork.category;
                obj.DataSource = "Artsy";
                obj.ThumbnailURL = artwork._links.image.href; 

                let splImage = obj.image.split("{image_version}"); 

                obj.ThumbnailURL = splImage[0] + artwork.image_versions[0] + splImage[1];

                try {
                    let ver = await verifyArtwork(obj); 

                    if (ver) {
                        // add the artwork to the SQL table
                        await helpers.add_verified_artwork(data);

                        console.log('adding artsy artist:', add_count);

                        add_count++;
                    } else {
                        console.log('not adding artsy artist:', rej_count, obj);

                        rej_count++;
                    }
                } catch (e) {
                    console.log('an error occurred:', e);
                }
            }
        }

        if (res._links && res._links.next && res._links.next.href) {
            console.log('next url is:', res._links.next.href);

            setTimeout(function() {
                requestArtsyArtworks(artist_id, res._links.next.href, token); 
            }, 250)
        }
    });
}

// verifies that the artwork data is clean
function verifyArtwork(obj) {
    return new Promise(async (resolve, reject) => {
        let verify = true; 

        verify = verify && !!obj.ConstituentID && (obj.ConstituentID.length > 0) && !!obj.ThumbnailURL;

	let exists = await helpers.verify_artist_exists(obj.ConstituentID[0]);

        verify = verify && exists && !!obj.Title && !!obj.Date && !!obj.ObjectID;

        resolve(verify);
    });
}

async function iterateArtsyArtists() {
    let artists = await helpers.get_artsy_artists(); 

    for (let artist of artists) {
        console.log('ARTIST IS', artist.ID);
        // TODO - FILL THIS IN
        // requestArtsyArtworks("4d8b92684eb68a1b2c00009e", null, "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6IiIsInN1YmplY3RfYXBwbGljYXRpb24iOiI1ZGI3NGUzZTQ0ZWRiNjAwMGVlNjEzMjUiLCJleHAiOjE1NzQwMDg0MTMsImlhdCI6MTU3MzQwMzYxMywiYXVkIjoiNWRiNzRlM2U0NGVkYjYwMDBlZTYxMzI1IiwiaXNzIjoiR3Jhdml0eSIsImp0aSI6IjVkYzgzYmRkYmY4M2MxMDAwZGI1ZmU0OSJ9.Tcb-dchhtXC2a36-T8BGvfHA3ABEAG76eXWt0lwKqV0");
    }
}

if (process.argv.length >= 3 && process.argv[2] === "moma") {
    requestMomaArtworks(); 
} else {
    // TODO - LOOP THROUGH ARTSY ARTISTS 
    iterateArtsyArtists();
}
