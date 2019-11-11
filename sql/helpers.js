module.exports.add_verified_artist = async (obj) => {
    let id = obj.ConstituentID; 
    let name = obj.DisplayName;
    let bio = obj.ArtistBio;
    let nationality = obj.Nationality;
    let beginDate = obj.BeginDate;
    let endDate = obj.endDate; 

    // TODO - SQL STATEMENT HERE, RESOLVE AFTER SUCCESS
    return new Promise((resolve, reject) => {
        resolve(); 
    })
}

module.exports.verify_artist_exists = (artist_id) => {
    // TODO - SQL STATEMENT HERE, RESOLVE AFTER SUCCESS
    return new Promise((resolve, reject) => {
        resolve(true); 
    })
}

module.exports.add_verified_artwork = async (obj) => {
    // TODO - SQL STATEMENT HERE, RESOLVE AFTER SUCCESS
    return new Promise((resolve, reject) => {
        resolve(); 
    })
}