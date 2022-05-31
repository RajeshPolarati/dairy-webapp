const { body, param, validationResult } = require('express-validator');
const db = require('../models/index')
const createEntryValiadtion = [
    body('description')
        .trim()
        .isLength({ min: 10 })
        .withMessage("description should have minimum of 10 letters"),
    body('date')
        .isDate()
        .withMessage("date should be valid")
]

const deleteValidation = [
    param("id")
        .isNumeric().withMessage("id should be a number")
        .custom(async (id) => {
            const data = await db.dairy.findAll({
                raw: true,
                where: {
                    id: id
                }
            })
            //console.log(data);
            if (data.length == 0) {
                return Promise.reject('Entry not found');
            }
        })
]
const updateValidation = [
    body('description')
        .trim()
        .isLength({ min: 10 })
        .withMessage("description should have minimum of 10 letters"),
    body('id')
        .isNumeric()
        .withMessage("id should be a number")
        .custom(async (id) => {
            const findEntry = await db.dairy.findByPk(id);
            //console.log(findEntry);
            if (!findEntry) {
                return Promise.reject('Entry not found');
            }
        })
]

module.exports = { deleteValidation, createEntryValiadtion, updateValidation }