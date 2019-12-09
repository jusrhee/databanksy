const mysql = require('mysql');
const _ = require('underscore');

let sql = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'djkhaled',
  database : 'databanksy'
});

sql.connect();

module.exports.get_artworks = () => {
    return new Promise((resolve, reject) => {
        sql.query(
          `SELECT a1.*, a2.*, a3.bio, a3.note, a3.role
          FROM moma_artists a1
          INNER JOIN artworks a2 ON a2.creator_ID=a1.ID
          INNER JOIN ulan_artists a3 ON a3.ID=a1.ulan_ID
          WHERE a1.ulan_ID IS NOT NULL
          ORDER BY RAND()
          LIMIT 20;
          `,
          function(err, res) {
            if (err) {
              reject(err);
            };

            resolve(res);
          }
        );
    })
}

module.exports.populate_artworks = (values) => {
    return new Promise((resolve, reject) => {
        sql.query(
          `SELECT a1.*, a2.*, a3.bio, a3.note, a3.role
          FROM moma_artists a1
          INNER JOIN artworks a2 ON a2.creator_ID=a1.ID
          INNER JOIN ulan_artists a3 ON a3.ID=a1.ulan_ID
          WHERE a2.artwork_ID IN (${values})
          LIMIT 20
          `,
          function(err, res) {
            if (err) {
              reject(err);
            };

            resolve(res);
          }
        );
    })
}

module.exports.get_artists_artworks = (id) => {
    return new Promise((resolve, reject) => {
        sql.query(
          `SELECT a1.*, a2.*, a3.bio, a3.note, a3.role
          FROM moma_artists a1
          INNER JOIN artworks a2 ON a2.creator_ID=a1.ID
          INNER JOIN ulan_artists a3 ON a3.ID=a1.ulan_ID
          WHERE a2.creator_ID="${id}"
          LIMIT 20;
          `,          
          function(err, res) {
            if (err) {
              reject(err);
            };

            resolve(res);
          }
        );
    })
}

module.exports.get_associated_artworks = (id) => {
    let artist_ID = `"${id}"`;

    return new Promise((resolve, reject) => {
        sql.query(
            `SELECT DISTINCT a2.*, a1.*, a3.bio, a3.note, a3.role
            FROM exhibitions a4
            INNER JOIN exhibitions a5 ON a5.exhibition_ID=a4.exhibition_ID AND a5.artist_ID<>${artist_ID}
            INNER JOIN moma_artists a1 ON a1.ID=(
              SELECT a.ID
              FROM moma_artists a 
              WHERE a.ID=a5.artist_ID
              LIMIT 1
            )
            INNER JOIN artworks a2 ON a2.creator_ID=a1.ID
            INNER JOIN ulan_artists a3 ON a3.ID=a1.ulan_ID
            WHERE a4.artist_ID=${artist_ID}
            LIMIT 100`,
          async function(err, res) {
            if (err) {
              reject(err);
            };

            resolve(_.sample(res, 20));
          }
        );
    })
}

module.exports.get_artist = (id) => {
    let artist_ID = `"${id}"`;

    return new Promise((resolve, reject) => {
        sql.query(
          `SELECT * FROM artists WHERE ID=${artist_ID} LIMIT 1;`,
          function(err, res) {
            if (err) {
              reject(err);
            };

            if (res[0]) resolve(res[0]);
          }
        );
    })
}

module.exports.verify_artwork_exists = (artwork_id) => {
    return new Promise((resolve, reject) => {
        sql.query(
          `SELECT * FROM artworks WHERE artwork_ID="${artwork_id}" LIMIT 1`,
          function(err, res) {
            if (err) {
              reject(err);
            };

            resolve(res && res.length > 0);
          }
        );
    })
}

module.exports.search = (keyword, classification, startDate, endDate) => {
  let classString = !!classification ? ` WHERE classification = "${classification}" AND ` : ' WHERE ';
  let dateString = (!!startDate && !!endDate) ? 
      `date REGEXP '^([0-9]{4})' AND date >= "${startDate}" AND date <= "${endDate}" AND ` : '';
  let searchString = `(
      a1.name LIKE '%${keyword}%'
      OR a2.title LIKE '%${keyword}%'
  )`;

  let query1 = `
    SELECT a1.*, a2.*, a3.bio, a3.note, a3.role
    FROM moma_artists a1
    INNER JOIN artworks a2 ON a2.creator_ID=a1.ID
    INNER JOIN ulan_artists a3 ON a3.ID=a1.ulan_ID`;

  let query2 = `
    LIMIT 20;
  `;

  let query = query1 + classString + dateString + searchString + query2;

  return new Promise((resolve, reject) => {
        sql.query(query,
          function(err, res) {
            if (err) {
              reject(err);
            };

            resolve(res);
          }
        );
    })
}