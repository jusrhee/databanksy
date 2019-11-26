
/* Creation and DDL statements

CREATE DATABASE databanksy;

USE databanksy;

CREATE TABLE artists(
  ID VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  bio VARCHAR(2000),
  nationality VARCHAR(255),
  beginDate VARCHAR(255),
  endDate VARCHAR(255),
  dataSource VARCHAR(255),
  PRIMARY KEY(ID)
);

CREATE TABLE artworks(
  artwork_ID VARCHAR(255) UNIQUE NOT NULL,
  creator_ID VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  date VARCHAR(255),
  cataloged VARCHAR(255),
  classification VARCHAR(255),
  dataSource VARCHAR(255),
  artsy_ID VARCHAR(255),
  image VARCHAR(255),
  PRIMARY KEY(artwork_ID),
  FOREIGN KEY(creator_ID) REFERENCES artists(ID)
);

CREATE TABLE exhibitions(
  exhibition_ID INT(10) NOT NULL,
  title VARCHAR(255) NOT NULL,
  beginDate date,
  endDate date,
  role VARCHAR(20),
  artist_ID VARCHAR(255) NOT NULL,
  artist_type VARCHAR(20),
  PRIMARY KEY(exhibition_ID, artist_ID),
  FOREIGN KEY(artist_ID) REFERENCES artists(ID)
)

ALTER TABLE databanksy.artists MODIFY COLUMN name VARCHAR(255)  
    CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL;

ALTER TABLE databanksy.artworks MODIFY COLUMN title VARCHAR(255)  
    CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL;
*/

const mysql = require('mysql');

let sql = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'djkhaled',
  database : 'databanksy'
});

sql.connect();

// NEED TO ADD SERVER LINK/INITIALIZATION TO DEFINE var sql
module.exports.add_verified_artist = async (obj) => {
    let id = `"${obj.ConstituentID}"`;
    let name = `"${obj.DisplayName.replace(/"/g, '\\\"')}"`;
    let bio = obj.ArtistBio ? `"${obj.ArtistBio.replace(/"/g, '\\\"')}"` : 'NULL';
    let nationality = obj.Nationality ? `"${obj.Nationality}"` : 'NULL';;
    let beginDate = obj.BeginDate ? `"${obj.BeginDate}"` : 'NULL';
    let endDate = obj.EndDate ? `"${obj.EndDate}"` : 'NULL';
    let dataSource = obj.DataSource ? `"${obj.DataSource}"` : 'NULL';

    return new Promise((resolve, reject) => {
        sql.query(
          `INSERT INTO artists 
          (ID, name, bio, nationality, beginDate, endDate, dataSource) 
          VALUES (${id}, ${name}, ${bio}, ${nationality}, ${beginDate}, ${endDate}, 
          ${dataSource})`,
          function(err, res) {
            if (err) {
              reject(err);
            } else {
              resolve(true);
            }
          }
        );
    })
}

module.exports.get_artsy_artists = async (obj) => {
    return new Promise((resolve, reject) => {
        sql.query(
          `SELECT ID FROM artists WHERE dataSource="Artsy"`,
          function(err, res) {
            if (err) {
              reject(err);
            } else {
              resolve(res);
            }
          }
        );
    })
}

module.exports.verify_artist_exists = (artist_id) => {
    // TODO - SQL STATEMENT HERE, RESOLVE AFTER SUCCESS
    return new Promise((resolve, reject) => {
        sql.query(
          `SELECT * FROM artists WHERE ID="${artist_id}" LIMIT 1`,
          function(err, res) {
            if (err) {
              reject(err);
            };
            if (res.length > 0) {
              resolve(true);
            } else {
              resolve(false);
            }
          }
        );
    })
}

module.exports.add_verified_artwork = async (obj) => {
    let creator_id = `"${obj.ConstituentID}"`;
    let object_id = `"${obj.ObjectID}"`;
    let title = `"${obj.Title.replace(/"/g, '\\\"')}"`;
    let date = obj.Date ? `"${obj.Date}"` : 'NULL';
    let cataloged = obj.Cataloged ? `"${obj.Cataloged}"` : 'NULL';
    let classification = obj.Classification ? `"${obj.Classification}"` : 'NULL';
    let dataSource = obj.DataSource ? `"${obj.DataSource}"` : 'NULL';
    let image = obj.ThumbnailURL ? `"${obj.ThumbnailURL}"` : 'NULL';

    return new Promise((resolve, reject) => {
        sql.query(
          `INSERT INTO artworks 
          (artwork_ID, creator_ID, title, date, cataloged, classification,
          dataSource, image) 
          VALUES (${object_id}, ${creator_id}, ${title}, ${date}, ${cataloged}, ${classification},
          ${dataSource}, ${image})`,
          function(err, res) {
            if (err) {
              reject(err);
            } else {
              resolve(true);
            }
          }
        );
    })
}

module.exports.add_verified_exhibition = async (obj) => {
    let exhibition_ID = `"${obj.ExhibitionID}"`;
    let title = `"${obj.ExhibitionTitle.replace(/"/g, '\\\"')}"`;
    let beginDate = `"${obj.ExhibitionBeginDate}"`;
    let endDate = `"${obj.ExhibitionEndDate}"`;
    let role = obj.ExhibitionRole ? `"${obj.ExhibitionRole}"` : 'NULL';
    let artist_ID = `"${obj.ConstituentID}"`;
    let artist_type = obj.ConstituentType ? `"${obj.ConstituentType}"` : 'NULL';

    return new Promise((resolve, reject) => {
        sql.query(
          `INSERT INTO artworks 
          (exhibition_ID, title, beginDate, endDate, role, artist_ID, artist_type) 
          VALUES (${exhibition_ID}, ${title}, ${beginDate}, ${endDate}, ${role}, ${artist_ID},
          ${artist_type})`,
          function(err, res) {
            if (err) {
              reject(err);
            } else {
              resolve(true);
            }
          }
        );
    })
}
