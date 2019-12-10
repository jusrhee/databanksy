In order to run the app locally, simply go into /server and 
type 'npm install'. Then, type 'node index.js' and navigate 
to localhost:3000 in the browser. 

In order to connect to our mysql database, use the following credentials:

host     : '34.69.32.88',
user     : 'root',
password : 'djkhaled',
database : 'databanksy'

In order to connect to our mongo database, use the following credentials:

username: 'root',
password: 'djkhaled',
url: 'cluster0-xnjlu.gcp.mongodb.net/databanksy'

If you would like to run the import code, of the XML, JSON, and CSV data 
must be in the /data directory within /import. Then, go into /import and 
type 'npm install'. Finally, code must be run in the following order:

ulan_xml_to_json.js  ***modify file for the four different XML files
ulan_artist.js 
moma_artist.js
artwork.js
exhibitions.js