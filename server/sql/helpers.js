const mysql = require('mysql');

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
          `SELECT * FROM artworks LIMIT 2000, 20`,
          function(err, res) {
            if (err) {
              reject(err);
            };

            resolve(res);
          }
        );
    })
}


let get_artists_artworks = (id) => {
    return new Promise((resolve, reject) => {
        sql.query(
          `SELECT * FROM artworks WHERE creator_ID="${id}" LIMIT 20;`,
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
          `SELECT *
            FROM
                artworks AW,
                (
                SELECT
                    E1.artist_ID
                FROM
                    exhibitions E1,
                    (
                    SELECT
                        *
                    FROM
                        exhibitions
                    WHERE
                        artist_ID = ${artist_ID}
                    LIMIT 1
                    ) as E2
                WHERE
                    E1.exhibition_ID = E2.exhibition_ID and
                    E1.artist_ID <> E2.artist_ID
                LIMIT 1
                ) as AT
            WHERE AW.creator_ID = AT.artist_ID;`,
          async function(err, res) {
            if (err) {
              reject(err);
            };

            resolve(res);
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
        sql3.query(
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