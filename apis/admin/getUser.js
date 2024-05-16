const connectDB = require("../../db/dbConnect");

async function GetUsers(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection('users');

        const users = await collection.find({ role: "2" }, { projection: { password: 0, role: 0 } }).toArray();

        if (!users) {
            return res.status(401).json({ success: false, message: "No users found" });
        }

        res.status(200)
            .json({ users, success: true, message: "Users found successfully" });
    } catch (error) {
        console.log("getUser.js", error);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
}

module.exports = { GetUsers };