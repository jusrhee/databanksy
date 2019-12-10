# 1 -- basic query -- 0.24 seconds
SELECT a1.*, a2.*, a3.bio, a3.note, a3.role
          FROM moma_artists a1
          INNER JOIN artworks a2 ON a2.creator_ID=a1.ID
          INNER JOIN ulan_artists a3 ON a3.ID=a1.ulan_ID
          WHERE a1.ulan_ID IS NOT NULL
          ORDER BY RAND();


# 2 -- search query - 0.05 seconds
    SELECT a1.*, a2.*, a3.bio, a3.note, a3.role
    FROM moma_artists a1
    INNER JOIN artworks a2 ON a2.creator_ID=a1.ID
    INNER JOIN ulan_artists a3 ON a3.ID=a1.ulan_ID WHERE classification = "Drawing" AND date REGEXP '^([0-9]{4})' AND date >= "1940" AND date <= "1945" AND (a1.name LIKE '%pablo%'
        OR a2.title LIKE '%pablo%')AND (a1.name LIKE '%picasso%'
        OR a2.title LIKE '%picasso%');

# 2 -- AFTER ADDITIONAL INDICES - 0.01 seconds

# 3 -- get artist's artworks - 0.01 seconds
SELECT a1.*, a2.*, a3.bio, a3.note, a3.role
          FROM moma_artists a1
          INNER JOIN artworks a2 ON a2.creator_ID=a1.ID
          INNER JOIN ulan_artists a3 ON a3.ID=a1.ulan_ID
          WHERE a2.creator_ID="4609";

# 4 -- expression 1 -- get associated artworks - 4.50 seconds
SELECT DISTINCT a2.*, a1.*, a3.bio, a3.note, a3.role
            FROM exhibitions a4
            INNER JOIN exhibitions a5 ON a5.exhibition_ID=a4.exhibition_ID AND a5.artist_ID<>"4609"
            INNER JOIN moma_artists a1 ON a1.ID=(
              SELECT a.ID
              FROM moma_artists a 
              WHERE a.ID=a5.artist_ID
              LIMIT 1
            )
            INNER JOIN artworks a2 ON a2.creator_ID=a1.ID
            INNER JOIN ulan_artists a3 ON a3.ID=a1.ulan_ID
            WHERE a4.artist_ID="4609"
            ORDER BY RAND ()
            LIMIT 100;

# 4 -- expression 2 - 2.99 seconds
SELECT DISTINCT a1.*, a2.*, a3.bio, a3.note, a3.role
FROM moma_artists a1
INNER JOIN artworks a2 ON a2.creator_ID=a1.ID
INNER JOIN ulan_artists a3 ON a3.ID=a1.ulan_ID
WHERE a2.artwork_ID IN (SELECT DISTINCT a2.artwork_ID
            FROM exhibitions a4
            INNER JOIN exhibitions a5 ON a5.exhibition_ID=a4.exhibition_ID AND a5.artist_ID<>"4609"
            INNER JOIN moma_artists a1 ON a1.ID=(
              SELECT a.ID
              FROM moma_artists a 
              WHERE a.ID=a5.artist_ID
              LIMIT 1
            )
            INNER JOIN artworks a2 ON a2.creator_ID=a1.ID
            INNER JOIN ulan_artists a3 ON a3.ID=a1.ulan_ID
            WHERE a4.artist_ID="4609")
            ORDER BY RAND()
            LIMIT 100;

# 5 -- populate artworks query - 0.04 seconds
SELECT a1.*, a2.*, a3.bio, a3.note, a3.role
          FROM moma_artists a1
          INNER JOIN artworks a2 ON a2.creator_ID=a1.ID
          INNER JOIN ulan_artists a3 ON a3.ID=a1.ulan_ID
          WHERE a2.artwork_ID IN (124762,52366,193715,298570,95520,69314,66710);


# 6 -- search by association

# 6 -- expression 1 -- 10.43 seconds
SELECT DISTINCT a7.*, a6.*, a8.bio, a8.note, a8.role
FROM exhibitions a4
INNER JOIN moma_artists a1 ON a1.ID=a4.artist_ID
INNER JOIN artworks a2 ON a2.creator_ID=a1.ID AND classification = "Drawing" AND date REGEXP '^([0-9]{4})' AND date >= "1940" AND date <= "1945" AND (a1.name LIKE '%pablo%'
        OR a2.title LIKE '%pablo%')AND (a1.name LIKE '%picasso%'
        OR a2.title LIKE '%picasso%')
INNER JOIN exhibitions a5 ON a5.exhibition_ID=a4.exhibition_ID AND a1.ID<>a5.artist_ID
INNER JOIN moma_artists a6 ON a6.ID=(
    SELECT a.ID
    FROM moma_artists a 
    WHERE a.ID=a5.artist_ID
    LIMIT 1
)
INNER JOIN artworks a7 ON a7.creator_ID=a6.ID
INNER JOIN ulan_artists a8 ON a8.ID=a6.ulan_ID
ORDER BY RAND()
LIMIT 100;

# 6 -- expression 2 - 4.30 seconds
SELECT DISTINCT a2.*, a1.*, a3.bio, a3.note, a3.role
FROM exhibitions a4
INNER JOIN exhibitions a5 ON a5.exhibition_ID=a4.exhibition_ID AND a5.artist_id NOT IN 
(SELECT a1.ID
    FROM moma_artists a1
    INNER JOIN artworks a2 ON a2.creator_ID=a1.ID
    WHERE classification = "Drawing" AND date REGEXP '^([0-9]{4})' AND date >= "1940" AND date <= "1945" AND (a1.name LIKE '%pablo%'
        OR a2.title LIKE '%pablo%')AND (a1.name LIKE '%picasso%'
        OR a2.title LIKE '%picasso%'))
INNER JOIN moma_artists a1 ON a1.ID=(
    SELECT a.ID
    FROM moma_artists a 
    WHERE a.ID=a5.artist_ID
    LIMIT 1
)
INNER JOIN artworks a2 ON a2.creator_ID=a1.ID
INNER JOIN ulan_artists a3 ON a3.ID=a1.ulan_ID
WHERE a4.artist_ID IN (SELECT a1.ID
    FROM moma_artists a1
    INNER JOIN artworks a2 ON a2.creator_ID=a1.ID
    WHERE classification = "Drawing" AND date REGEXP '^([0-9]{4})' AND date >= "1940" AND date <= "1945" AND (a1.name LIKE '%pablo%'
        OR a2.title LIKE '%pablo%')AND (a1.name LIKE '%picasso%'
        OR a2.title LIKE '%picasso%'))
ORDER BY RAND()
LIMIT 100;

# 6 -- expression 3 - 0.58 seconds 
SELECT a1.*, a2.*, a3.bio, a3.note, a3.role
FROM moma_artists a1
INNER JOIN artworks a2 ON a2.creator_ID=a1.ID
INNER JOIN ulan_artists a3 ON a3.ID=a1.ulan_ID
WHERE a2.artwork_ID IN (SELECT DISTINCT a2.artwork_ID
FROM exhibitions a4
INNER JOIN exhibitions a5 ON a5.exhibition_ID=a4.exhibition_ID AND a5.artist_id NOT IN 
(SELECT a1.ID
    FROM moma_artists a1
    INNER JOIN artworks a2 ON a2.creator_ID=a1.ID
    WHERE classification = "Drawing" AND date REGEXP '^([0-9]{4})' AND date >= "1940" AND date <= "1945" AND (a1.name LIKE '%pablo%'
        OR a2.title LIKE '%pablo%')AND (a1.name LIKE '%picasso%'
        OR a2.title LIKE '%picasso%'))
INNER JOIN moma_artists a1 ON a1.ID=(
    SELECT a.ID
    FROM moma_artists a 
    WHERE a.ID=a5.artist_ID
    LIMIT 1
)
INNER JOIN artworks a2 ON a2.creator_ID=a1.ID
INNER JOIN ulan_artists a3 ON a3.ID=a1.ulan_ID
WHERE a4.artist_ID IN 
(SELECT a1.ID
    FROM moma_artists a1
    INNER JOIN artworks a2 ON a2.creator_ID=a1.ID
    WHERE classification = "Drawing" AND date REGEXP '^([0-9]{4})' AND date >= "1940" AND date <= "1945" AND (a1.name LIKE '%pablo%'
        OR a2.title LIKE '%pablo%')AND (a1.name LIKE '%picasso%'
        OR a2.title LIKE '%picasso%')))
ORDER BY RAND()
LIMIT 100;

# 6 -- after additional indices - 0.56 seconds