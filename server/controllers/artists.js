const query = require('../sql/helpers.js');

module.exports.get_artist = async (req, res) => {
    if (!req.query.id) {
        res.status(400).send('id required');
    }
    
    try {
        let resp = await query.get_artist(req.query.id);

        res.status(200).send(resp);
    } catch (e) {
        res.status(500).send('Internal server error');
    } 
}