const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function GetProfile(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection('users');

        const session = req.userData.decodedToken.user;
        const userId = session._id;
        const user = await collection.findOne({ _id: new ObjectId(userId) });

        if (!user) {
            return res.status(401).json({ success: false, message: "No User Found!" });
        }

        res
            .status(200)
            .json({ user, success: true, message: "User Data Found Successful" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
}

module.exports = { GetProfile };