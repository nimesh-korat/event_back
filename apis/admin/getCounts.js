const connectDB = require("../../db/dbConnect");

async function GetCounts(req, res) {
    try {
        const db = await connectDB();
        const userCount = await db.collection('users').countDocuments({ role: "2" });
        const artistCount = await db.collection('users').countDocuments({ role: "1" });
        const complaintCount = await db.collection('complaints').countDocuments();

        const counts = {
            userCount,
            artistCount,
            complaintCount
        }

        res.status(200)
            .json({ counts, success: true, message: "Counts found successfully" });

    } catch (error) {
        console.log("GetCounts.js", error);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
}

module.exports = { GetCounts };