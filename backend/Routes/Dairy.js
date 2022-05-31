const express = require('express');
const router = express.Router();
const verifytoken = require("../TokenVerification")
const db = require('../models/index')
const { validationResult } = require('express-validator');
const { createEntryValiadtion, deleteValidation, updateValidation } = require("../Validation/Entryvalidation")
router.post('/create', verifytoken, createEntryValiadtion, async (req, res, next) => {
    // console.log(req)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    } else {
        const data = {
            description: req.body.description,
            date: req.body.date,
            useremail: req.verifiedDetails.email
        }
        console.log(data);
        try {
            const Entry = await db.dairy.create(data)
            console.log(Entry.toJSON());
            res.status(200).json({ message: "Successfully Added" })
        }
        catch (err) {
            res.status(500).json({ error: err.toString() })
        }
    }
})


router.get("/", verifytoken, async (req, res) => {
    try {
        const Entries = await db.dairy.findAll({
            raw: true,
            where: {
                useremail: req.verifiedDetails.email
            }
        })
        res.status(200).json({ Entries: Entries })
    }
    catch (err) {
        res.status(500).json({ error: err.toString() })
    }
})


router.put("/", verifytoken, updateValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    } else {
        try {
            const isUserEntry = await db.dairy.findAll({
                raw: true,
                where: {
                    id: req.body.id,
                    useremail: req.verifiedDetails.email
                }
            })
            if (isUserEntry.length == 0) {
                res.status(401).json({ error: "Unauthorised request" })
            } else {
                console.log(isUserEntry);
                const updatedEntry = await db.dairy.update({ description: req.body.description }, {
                    where: {
                        id: req.body.id
                    }
                });
                console.log(updatedEntry);
                res.status(200).json({ message: "Entry Updated successfully" })
            }

        } catch (err) {
            res.status(500).json({ error: err.toString() })
        }
    }
})


router.delete("/:id", verifytoken, deleteValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    } else {
        try {
            const isUserEntry = await db.dairy.findAll({
                raw: true,
                where: {
                    id: req.params.id,
                    useremail: req.verifiedDetails.email
                }
            })
            if (isUserEntry.length == 0) {
                res.status(401).json({ error: "Unauthorised request" })
            } else {
                console.log(isUserEntry);
                const deletedEntry = await db.dairy.destroy({
                    where: {
                        id: req.params.id
                    }
                });
                console.log(deletedEntry);
                res.status(200).json({ message: "Entry deleted successfully" })
            }

        }
        catch (err) {
            res.status(500).json({ error: err.toString() })
        }
    }

})
module.exports = router;