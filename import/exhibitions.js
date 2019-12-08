const csv = require('csv-parser')
const helpers = require('./sql/helpers.js')
const fs = require('fs')

let add_count = 0; 


fs.createReadStream('./data/MoMAExhibitions1929to1989.csv')
  .pipe(csv())
  .on('data', async function(data) {
        try {
            // add the artwork to the SQL table
            await helpers.add_verified_exhibition(data);

            console.log('adding artwork:', add_count);

            add_count++;
        } catch (e) {
            console.log('an error occurred:', e, data);
        }
    })
  .on('end', () => {
    console.log('FINISHED');
  });
