const mysql = require('mysql');

let sql1 = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'djkhaled',
  database : 'databanksy'
});

sql1.connect();

let sql2 = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'djkhaled',
  database : 'databanksy'
});

sql2.connect();

let sql3 = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'djkhaled',
  database : 'databanksy'
});

sql3.connect();

module.exports.bulk_add_verified_ulan_artist = async (values) => {
    return new Promise((resolve, reject) => {
        sql1.query(
          `INSERT IGNORE INTO ulan_artists 
          (ID, name, bio, note, role) 
          VALUES ?`, [values],
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

module.exports.find_ulan_artist = async (first, last) => {
  first = first.replace("'", "''");
  last = last.replace("'", "''");
  
  return new Promise((resolve, reject) => {
        sql1.query(
          `SELECT * 
          FROM ulan_artists 
          WHERE name LIKE '%${first}%' AND name LIKE '%${last}%' AND role LIKE '%artist%';`,
          function(err, res) {
            if (err) {
              reject(err);
            };
            if (res && res.length == 1) {
              resolve(res[0].ID);
            } else {
              resolve(null);
            }
          }
        );
    })
}

module.exports.add_verified_moma_artist = async (obj) => {
    let id = `"${obj.ConstituentID}"`;
    let ulan_ID = obj.ulan_ID ? `${obj.ulan_ID}` : 'NULL';
    let name = `"${obj.DisplayName.replace(/"/g, '\\\"')}"`;
    let bio = obj.ArtistBio ? `"${obj.ArtistBio.replace(/"/g, '\\\"')}"` : 'NULL';
    let nationality = obj.Nationality ? `"${obj.Nationality}"` : 'NULL';
    let beginDate = obj.BeginDate ? `"${obj.BeginDate}"` : 'NULL';
    let endDate = obj.EndDate ? `"${obj.EndDate}"` : 'NULL';
    let dataSource = obj.DataSource ? `"${obj.DataSource}"` : 'NULL';

    return new Promise((resolve, reject) => {
        sql2.query(
          `INSERT INTO moma_artists (ID, ulan_ID, name, bio, nationality, beginDate, endDate, dataSource) 
          VALUES (${id}, ${ulan_ID}, ${name}, ${bio}, ${nationality}, ${beginDate}, ${endDate}, ${dataSource})`,
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

module.exports.verify_moma_artist_exists = (artist_id) => {
    // TODO - SQL STATEMENT HERE, RESOLVE AFTER SUCCESS
    return new Promise((resolve, reject) => {
        sql3.query(
          `SELECT * FROM moma_artists WHERE ID="${artist_id}" LIMIT 1`,
          function(err, res) {
            if (err) {
              reject(err);
            };

            resolve(res && res.length > 0);
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
        sql2.query(
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
        sql2.query(
          `INSERT INTO exhibitions 
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
