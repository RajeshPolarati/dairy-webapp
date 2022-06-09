const express = require('express');
const router = express.Router();
const verifytoken = require("../TokenVerification")
const db = require('../models/index')
const { Op } = require("sequelize");
const { body, validationResult } = require('express-validator');
const { updateCredentialValidation, createCredentialValidation, deleteCredentialValidation } = require("../Validation/CredentialsValidation")

router.post("/create", verifytoken, createCredentialValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    } else {
        //console.log(req.body);
        try {
            const allCredentials = await db.credentials.findAll({
                where: {
                    platform: {
                        [Op.iLike]: req.body.platform
                    },
                    useremail: req.verifiedDetails.email
                }
            })
            if (allCredentials.length == 0) {
                const data = {
                    platform: req.body.platform,
                    useremail: req.verifiedDetails.email,
                    username: req.body.username,
                    password: req.body.password
                }
                const newCredential = await db.credentials.create(data)
                console.log(newCredential.toJSON());
                res.status(200).json({ message: "Successfully Added" })
            } else {
                res.status(400).json({ message: "platform already exists" })
            }
            console.log(allCredentials);
        } catch (err) {
            res.status(500).json({ error: err.toString() })
        }
    }
    //console.log(req.body);
});


router.get("/", verifytoken, async (req, res) => {
    try {
        const AllCredentials = await db.credentials.findAll({
            raw: true,
            where: {
                useremail: req.verifiedDetails.email
            }
        })
        res.status(200).json({ AllCredentials: AllCredentials })
    }
    catch (err) {
        res.status(500).json({ error: err.toString() })
    }
});



router.put("/", verifytoken, updateCredentialValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    } else {
        try {
            const isUserCredential = await db.credentials.findAll({
                raw: true,
                where: {
                    id: req.body.id,
                    useremail: req.verifiedDetails.email
                }
            })
            if (isUserCredential.length == 0) {
                res.status(401).json({ error: "Unauthorised request" })
            } else {
                console.log(isUserCredential);
                const allCredentials = await db.credentials.findAll({
                    raw: true,
                    where: {
                        platform: {
                            [Op.iLike]: req.body.platform
                        },
                        useremail: req.verifiedDetails.email,
                        id: {
                            [Op.ne]: req.body.id
                        }
                    }
                })
                //console.log(allCredentials);
                if (allCredentials.length == 0) {
                    const updatedCredential = await db.credentials.update({
                        username: req.body.username,
                        password: req.body.password,
                        platform: req.body.platform
                    }, {
                        where: {
                            id: req.body.id
                        }
                    });
                    console.log(updatedCredential);
                    res.status(200).json({ message: "Credential updated successfully" })
                } else {
                    res.status(400).json({ message: "platform already exists!" })
                }

            }

        } catch (err) {
            res.status(500).json({ error: err.toString() })
        }
    }
});



router.delete("/:id", verifytoken, deleteCredentialValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    } else {
        try {
            const isUserCredential = await db.credentials.findAll({
                raw: true,
                where: {
                    id: req.params.id,
                    useremail: req.verifiedDetails.email
                }
            })
            if (isUserCredential.length == 0) {
                res.status(401).json({ error: "Unauthorised request" })
            } else {
                console.log(isUserCredential);
                const deletedCredential = await db.credentials.destroy({
                    where: {
                        id: req.params.id
                    }
                });
                console.log(deletedCredential);
                res.status(200).json({ message: "Credential deleted successfully" })
            }

        }
        catch (err) {
            res.status(500).json({ error: err.toString() })
        }
    }
});

module.exports = router;