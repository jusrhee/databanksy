
/* DDL statements

CREATE TABLE artists(
  ID VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  bio VARCHAR(500),
  nationality VARCHAR(255),
  beginDate VARCHAR(255),
  endDate VARCHAR(255),
  PRIMARY KEY(ID)
);

CREATE TABLE artworks(
  creator_ID VARCHAR(255) NOT NULL,
  artwork_ID VARCHAR(255) NOT NULL
  title VARCHAR(255) NOT NULL,
  date VARCHAR(255),
  cataloged VARCHAR(255),
  classification VARCHAR(255)
);

*/

// NEED TO ADD SERVER LINK/INITIALIZATION TO DEFINE var sql
module.exports.add_verified_artist = async (obj) => {
    let id = obj.ConstituentID;
    let name = obj.DisplayName;
    let bio = obj.ArtistBio;
    let nationality = obj.Nationality;
    let beginDate = obj.BeginDate;
    let endDate = obj.EndDate;

    return new Promise((resolve, reject) => {
        sql.query(
          'INSERT INTO artists (ID, name, bio, nationality, beginDate, endDate) VALUES ("' + id + '", "' + name '", "' + bio +'", "' + nationality +'", "' + beginDate +'", "' + endDate + '")',
          function(err, res) {
            if (err) {
              resolve(false);
              throw err;
            } else {
              resolve(true);
            }
          }
        );
    })
}

module.exports.verify_artist_exists = (artist_id) => {
    // TODO - SQL STATEMENT HERE, RESOLVE AFTER SUCCESS
    return new Promise((resolve, reject) => {
        sql.query(
          'SELECT * FROM artworks WHERE id="' + artist_id + '"',
          function(err, res) {
            if (err) {
              resolve(false);
              throw err;
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
    let creator_id = obj.ConstituentID;
    let object_id = obj.ObjectID;
    let title = obj.Title;
    let date = obj.Date;
    let cataloged = obj.Cataloged;
    let classification = obj.Classification;

    return new Promise((resolve, reject) => {
        sql.query(
          'INSERT INTO artworks (creator_ID, artwork_ID, title, date, cataloged, classification) VALUES ("' + creator_id + '", "' + object_id '", "' + title +'", "' + date +'", "' + cataloged +'", "' + classification + '")',
          function(err, res) {
            if (err) {
              resolve(false);
              throw err;
            } else {
              resolve(true);
            }
          }
        );
    })
}
