const query = require('../sql/helpers.js');

module.exports.get_artworks = async (req, res) => {
    try {
        let resp = await query.get_artworks();

        res.status(200).send(resp);
    } catch (e) {
        res.status(500).send('Internal server error');
    } 
}

module.exports.get_associated_artworks = async (req, res) => {
    if (!req.query.id) {
        res.status(400).send('id required');
    }

    try {
        let resp = await query.get_associated_artworks(req.query.id);

        res.status(200).send(resp);
    } catch (e) {
        res.status(500).send('Internal server error');
    } 
}