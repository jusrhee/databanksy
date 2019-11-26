const fs = require('fs')
const JSONStream = require('JSONStream');
const helpers = require('./sql/helpers.js');
const request = require('request');

let requestMomaArtists = () => {
    let stream = fs.createReadStream('./Artists.json', {encoding: 'utf8'});
    let parser = JSONStream.parse('*'); 

    stream.pipe(parser);

    let add_count = 0; 
    let rej_count = 0; 

    parser.on('data', async function(data) {
        try {
            let ver = await verifyArtist(data); 
            
            data.DataSource = "MOMA";

            if (ver) {
                // add the artist to the SQL table
                await helpers.add_verified_artist(data);

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

let requestArtsyArtists = (url, token) => {
    const options = {
      url: url,
      headers: {
        'X-XAPP-Token': token
      }
    };

    let add_count = 0; 
    let rej_count = 0; 

    request(options, async function (err, response, body) {
        if (err) console.error('error:', error); 

        res = JSON.parse(body); 

        // insert res into database 

        if (res._embedded && res._embedded.artists && res._embedded.artists.length > 0) {
            for (let artist of res._embedded.artists) {
                let obj = {};

                obj.ConstituentID = artist.id;
                obj.DisplayName = artist.sortable_name;
                obj.ArtistBio = artist.biography;
                obj.Nationality = artist.nationality;
                obj.BeginDate = artist.birthday;
                obj.EndDate = artist.deathday;
                obj.DataSource = "Artsy";

                try {
                    let ver = await verifyArtist(obj); 

                    if (ver) {
                        // add the artist to the SQL table
                        await helpers.add_verified_artist(obj);

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
                requestArtsyArtists(res._links.next.href, token); 
            }, 250)
        }
    });
}

// verifies that the artist data is clean
function verifyArtist(obj) {
    return new Promise(async (resolve, reject) => {
        let verify = true; 

        verify = verify && obj.ConstituentID && obj.DisplayName; 

        // check if the artist exists or not
        let exists = await helpers.verify_artist_exists(obj.ConstituentID); 

        if (exists) {
            resolve(false);
        } else {
            resolve(verify);
        }
    });
}

if (process.argv.length >= 3 && process.argv[2] === "moma") {
    requestMomaArtists(); 
} else {
    let url = process.argv.length < 3 ? 'https://api.artsy.net/api/artists' : process.argv[2];

    requestArtsyArtists(url, "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6IiIsInN1YmplY3RfYXBwbGljYXRpb24iOiI1ZGI3NGUzZTQ0ZWRiNjAwMGVlNjEzMjUiLCJleHAiOjE1NzQwMDg0MTMsImlhdCI6MTU3MzQwMzYxMywiYXVkIjoiNWRiNzRlM2U0NGVkYjYwMDBlZTYxMzI1IiwiaXNzIjoiR3Jhdml0eSIsImp0aSI6IjVkYzgzYmRkYmY4M2MxMDAwZGI1ZmU0OSJ9.Tcb-dchhtXC2a36-T8BGvfHA3ABEAG76eXWt0lwKqV0");
}