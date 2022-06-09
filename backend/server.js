const express = require('express');
const app = express();
const multer = require('multer')
const cors = require("cors")
require("dotenv").config();
const path = require('path')
const AuthRouter = require('./Routes/Auth')
const DairyRouter = require('./Routes/Dairy')
const CredentialsRouter = require('./Routes/Credentials')
const bodyParser = require('body-parser');
const fileupload = require('express-fileupload')

app.use(express.static("./public"))
app.use(cors())
app.use(express.json());
app.use(
    fileupload({
        createParentPath: true,
    }),
);

app.use(express.urlencoded({ extended: true }))
app.use("/auth", AuthRouter);
app.use("/dairy", DairyRouter);
app.use("/credentials", CredentialsRouter);

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})