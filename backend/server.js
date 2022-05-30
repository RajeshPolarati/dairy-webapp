const db = require("./models/index")
async function find() {
    const users = await db.Users.findAll({ include: db.dairy });
    console.log("All users:", JSON.stringify(users, null, 2));
}
find()