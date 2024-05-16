const connectDB = require("../../db/dbConnect");

async function GetComplaint(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection('complaints');

        const complaint = await collection.find().toArray();

        if (!complaint) {
            return res.status(401).json({ success: false, message: "No complaint found" });
        }

        res.status(200)
            .json({ complaint, success: true, message: "complaint found successfully" });

    } catch (error) {
        console.log("getcomplaint.js", error);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
}

module.exports = { GetComplaint };