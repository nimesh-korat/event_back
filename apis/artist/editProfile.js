const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function EditProfile(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection('users');

        const session = req.userData.decodedToken.user;
        if (!session) {
            return res.status(401).json({ success: false, message: "Unauthorized access" });
        }


        const userId = session._id;

        const { name, email, phoneNo, address, experiance, category } = req.body;
        const profilePic = req.file.filename;

        if (!name || !email || !phoneNo || !address || !profilePic || !experiance || !category) {
            return res.status(400).json({ success: false, message: "Missing required fields!" });
        }

        const userExist = await collection.findOne({ _id: new ObjectId(userId) });
        if (!userExist) {
            return res
                .status(400)
                .json({ success: false, message: "User not exist" });
        }


        await collection.updateOne(
            { _id: new ObjectId(userId) },
            {
                $set: {
                    name,
                    email,
                    phoneNo,
                    address,
                    experiance,
                    category,
                    profilePic
                }
            });
        return res
            .status(201)
            .json({ success: true, message: "Profile updated successfully" });



    } catch (error) {
        console.error("editProfile.js: ", error);
        return res.status(500).json({ success: false, error: "Updation Failed" });
    }
}

module.exports = { EditProfile };