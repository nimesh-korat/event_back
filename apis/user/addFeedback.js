const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function AddFeedBack(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection('feedback');

        const { review, rating } = req.body;

        if (!review || !rating) {
            return res.status(400).json({ success: false, message: "Missing required fields!" });
        }

        const session = await req.userData.decodedToken.user;
        if (!session) {
            return res.status(401).json({ success: false, message: "Unauthorized access" });
        }
        const userId = session._id;

        await collection.insertOne({
            userId: new ObjectId(userId),
            review,
            rating,
        });

        return res
            .status(201)
            .json({ success: true, message: "Feedback added successfully" });

    } catch (error) {
        console.error("addFeedback.js: ", error);
        return res.status(500).json({ success: false, error: "something went wrong" });
    }
}

module.exports = { AddFeedBack };