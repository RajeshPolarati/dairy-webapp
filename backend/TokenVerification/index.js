const jwt = require('jsonwebtoken');

const verifytoken = (req, res, next) => {
    const authHeader = req.headers['authorization']

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        if (token) {
            //console.log(token);
            try {
                let decoded = jwt.verify(token, 'SecretKey');
                req.verifiedDetails = { email: decoded.email }
                //console.log(req.verifiedDetails);
                next();
            } catch (err) {
                res.status(400).json({ error: err.toString() });
            }
        } else {
            res.status(400).json({ error: "Token missing" })
        }
    } else {
        res.status(400).json({ error: "Auth header missing" })
    }

}

module.exports = verifytoken;