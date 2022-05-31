const { body, validationResult } = require('express-validator');
const db = require('../models/index')
const bcrypt = require('bcrypt');
const Registervalidate = [
    body('name')
        .isAlpha().withMessage("username should not contain numbers")
        .isLength({ min: 5 }).withMessage("username should not min 5 characters"),
    body('email')
        .isEmail().withMessage("Enter a valid Email address")
        .custom(async (value) => {
            const email = await db.users.findByPk(value)
            if (email !== null) {
                return Promise.reject('E-mail already in use');
            }
        }),
    body('mobile')
        .isNumeric().withMessage("Mobile Number should be a number")
        .isLength({ min: 10, max: 10 }).withMessage("Mobile Number should number contain 10 digits"),
    body('password')
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 0,
        })
        .withMessage("password should contain numbers and upper and lowercase letters"),
    body('age')
        .trim()
        .isInt()
        .withMessage("age should be a number")

    // .custom(val => {
    //     if (val <= 0) {
    //         return Promise.reject('Age should be valid');
    //     }
    // })

]

const LoginValidate = [
    body('email')
        .isEmail().withMessage("Enter a valid Email address"),
    body('password')
        .isString().withMessage("Enter a string")
        .notEmpty().withMessage("password should not be empty")

]


const ValidateUserDetails = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    } else {
        const user = await db.users.findByPk(req.body.email);

        if (!user) {
            res.status(404).json({ message: "You are not Registered!" });
        } else {
            let userPassword = user.toJSON().password
            //console.log(userPassword);
            const isPasswordValid = bcrypt.compareSync(req.body.password, userPassword)
            if (isPasswordValid) {
                next()
            } else {
                res.status(401).json({ message: "Password doesn't match" });
            }
        }

    }
}

module.exports = { ValidateUserDetails, LoginValidate, Registervalidate }