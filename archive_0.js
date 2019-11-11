const request = require('request');
const googleTrends = require('google-trends-api');

let num_artists = 0; 
let num_hits = 0; 

let requestArtists = (url, token) => {
    const options = {
      url: url,
      headers: {
        'X-XAPP-Token': token
      }
    };

    request(options, function (err, response, body) {
        if (err) console.error('error:', error); 

        res = JSON.parse(body); 

        // insert res into database 

        if (res._embedded && res._embedded.artists && res._embedded.artists.length > 0) {
            for (let artist of res._embedded.artists) {
                console.log(artist.sortable_name, artist.hometown); 

                // num_artists += 1; 

                /*googleTrends.interestOverTime({keyword: artist.sortable_name + ' artist'})
                .then(function(results) {
                    results = JSON.parse(results); 

                    if (results && results.default && results.default.timelineData
                        && results.default.timelineData.length > 0) {
                        num_hits += 1; 
                        console.log('ratio:', (num_hits / num_artists), num_hits, num_artists); 
                    }
                }).catch(function(err){
                    console.error('Trends error:', err);
                });*/
            }
        }

        if (res._links && res._links.next && res._links.next.href) {
            console.log('next:', res._links.next.href);
            setTimeout(function() {
                requestArtists(res._links.next.href, token); 
            }, 250); 
        }
    });
}

// get user input
if (process.argv.length < 3) {
    console.log('Please specify a starting URL');
} else {
    requestArtists(process.argv[2], "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6IiIsInN1YmplY3RfYXBwbGljYXRpb24iOiI1ZGI3NGUzZTQ0ZWRiNjAwMGVlNjEzMjUiLCJleHAiOjE1NzQwMDg0MTMsImlhdCI6MTU3MzQwMzYxMywiYXVkIjoiNWRiNzRlM2U0NGVkYjYwMDBlZTYxMzI1IiwiaXNzIjoiR3Jhdml0eSIsImp0aSI6IjVkYzgzYmRkYmY4M2MxMDAwZGI1ZmU0OSJ9.Tcb-dchhtXC2a36-T8BGvfHA3ABEAG76eXWt0lwKqV0");
}