const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const db = require('../models/index')
var jwt = require('jsonwebtoken');
const { Registervalidate, LoginValidate, ValidateUserDetails } = require("../Validation/Authvalidation")


router.post("/login", LoginValidate, ValidateUserDetails, (req, res) => {
    console.log(req.body)
    const payload = { email: req.body.email }
    const token = jwt.sign(payload, 'SecretKey')
    res.status(200).json({ authToken: token })
})


router.post("/register", Registervalidate, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    } else {
        const hashedPassword = bcrypt.hashSync(req.body.password, 10)
        console.log(hashedPassword);
        const data = {
            name: req.body.name,
            email: req.body.email,
            age: req.body.age,
            password: hashedPassword,
            mobile: req.body.mobile
        }
        try {
            const user = await db.users.create(data)
            console.log(user.toJSON()); // This is good!
            res.status(200).json({ message: "Successfully Registered" })
        }
        catch (err) {
            res.status(500).json({ error: err.toString() })
        }
    }


})
module.exports = router;