# SET PASSWORD FOR 'root'@'localhost' = PASSWORD('djkhaled');

CREATE DATABASE databanksy;

USE databanksy;

CREATE TABLE ulan_artists(
  ID VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  bio VARCHAR(2000),
  note VARCHAR(4000),
  role VARCHAR(255)
);

CREATE TABLE moma_artists(
  ID VARCHAR(255) UNIQUE NOT NULL,
  ulan_ID VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  bio VARCHAR(2000),
  nationality VARCHAR(255),
  beginDate VARCHAR(255),
  endDate VARCHAR(255),
  dataSource VARCHAR(255),
  PRIMARY KEY(ID),
  FOREIGN KEY(ulan_ID) REFERENCES ulan_artists(ID)
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
  FOREIGN KEY(creator_ID) REFERENCES moma_artists(ID)
);

CREATE TABLE exhibitions(
  exhibition_ID INT(10) NOT NULL,
  title VARCHAR(255) NOT NULL,
  beginDate VARCHAR(255) NOT NULL,
  endDate VARCHAR(255) NOT NULL,
  role VARCHAR(20),
  artist_ID VARCHAR(255) NOT NULL,
  artist_type VARCHAR(20),
  PRIMARY KEY(exhibition_ID, artist_ID),
  FOREIGN KEY(artist_ID) REFERENCES moma_artists(ID)
);

ALTER TABLE databanksy.ulan_artists MODIFY COLUMN name VARCHAR(255)  
    CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL;

ALTER TABLE databanksy.moma_artists MODIFY COLUMN name VARCHAR(255)  
    CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL;

ALTER TABLE databanksy.artworks MODIFY COLUMN title VARCHAR(255)  
    CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL;