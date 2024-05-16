const connectDB = require("../../db/dbConnect");

async function GetFeedback(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection('feedback');

        const feedback = await collection.find().toArray();

        if (!feedback) {
            return res.status(401).json({ success: false, message: "No feedback found" });
        }

        res.status(200)
            .json({ feedback, success: true, message: "feedback found successfully" });

    } catch (error) {
        console.log("getFeedback.js", error);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
}

module.exports = { GetFeedback };