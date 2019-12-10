const query = require('../sql/helpers.js');

module.exports.get_artworks = async (req, res) => {
    try {
        let resp = await query.get_artworks();

        res.status(200).send(resp);
    } catch (e) {
        console.error(e);
        res.status(500).send('Internal server error');
    } 
}

module.exports.get_associated_artworks = async (req, res) => {
    if (!req.query.id) {
        res.status(400).send('id required');
    }

    try {
        let artists = await query.get_artists_artworks(req.query.id);
        let similar = await query.get_associated_artworks(req.query.id);

        res.status(200).json({
            artists: artists,
            similar: similar
        });
    } catch (e) {
        console.error(e);
        res.status(500).send('Internal server error');
    } 
}

module.exports.get_artworks_search = async (req, res) => {
    if (!req.query.keyword) {
        res.status(400).send('keyword required');
    }

    try {
        let results = await query.search(req.query.keyword,
            req.query.classification, req.query.startDate, req.query.endDate);

        res.status(200).json(results);
    } catch (e) {
        console.error(e);
        res.status(500).send('Internal server error');
    } 
}

module.exports.get_artworks_search_associated = async (req, res) => {
    if (!req.query.keyword) {
        res.status(400).send('keyword required');
    }

    try {
        let results = await query.search_associated(req.query.keyword,
            req.query.classification, req.query.startDate, req.query.endDate);

        res.status(200).json(results);
    } catch (e) {
        console.error(e);
        res.status(500).send('Internal server error');
    } 
}