const { body, param, validationResult } = require('express-validator');
const db = require('../models/index')
const createCredentialValidation = [
    body('username')
        .trim()
        .notEmpty().withMessage("Username should not be empty!"),
    body('platform')
        .trim()
        .notEmpty().withMessage("Platform should not be empty!"),
    body('password')
        .trim()
        .notEmpty().withMessage("Password should not be empty!")
]

const deleteCredentialValidation = [
    param("id")
        .isNumeric().withMessage("id should be a number")
        .custom(async (id) => {
            const data = await db.credentials.findAll({
                raw: true,
                where: {
                    id: id
                }
            })
            console.log(data);
            if (data.length == 0) {
                return Promise.reject('Entry not found');
            }
        })
]

const updateCredentialValidation = [
    body('username')
        .trim()
        .notEmpty().withMessage("Username should not be empty!"),
    body('platform')
        .trim()
        .notEmpty().withMessage("Platform should not be empty!"),
    body('password')
        .trim()
        .notEmpty().withMessage("Password should not be empty!"),
    body("id")
        .isNumeric().withMessage("id should be a number")
        .custom(async (id) => {
            const data = await db.credentials.findAll({
                raw: true,
                where: {
                    id: id
                }
            })
            console.log(data);
            if (data.length == 0) {
                return Promise.reject('Entry not found');
            }
        })

]

module.exports = { updateCredentialValidation, createCredentialValidation, deleteCredentialValidation }