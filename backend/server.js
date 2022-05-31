const express = require('express');
const app = express();
app.use(express.json());
const AuthRouter = require('./Routes/Auth')
const DairyRouter = require('./Routes/Dairy')
const CredentialsRouter = require('./Routes/Credentials')



app.use("/auth", AuthRouter);
app.use("/dairy", DairyRouter);
app.use("/credentials", CredentialsRouter);
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})





// const db = require("./models/index")
// async function find() {
//     const users = await db.users.findAll({ include: db.dairy }).catch(err => {
//         console.log(err);
//     });
//     console.log("All users:", JSON.stringify(users, null, 2));
// }
// find()