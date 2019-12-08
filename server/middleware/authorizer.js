const UserService = require('../mongo/user_functions');

module.exports.verify_logged_in = async (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.status(403).send("Unauthorized request");
    }
}