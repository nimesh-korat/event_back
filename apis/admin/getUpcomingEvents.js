const connectDB = require("../../db/dbConnect");

async function GetUpcomingEvents(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection('events');

        const currentDate = new Date();
        const upcomingEvents = await collection.find({ datetime: { $gte: currentDate } }).toArray();

        return res.status(200).json({ success: true, upcomingEvents });
    } catch (error) {
        console.error("GetUpcomingEvents.js:", error);
        return res.status(500).json({ success: false, error: "Something went wrong!" });
    }
}

module.exports = { GetUpcomingEvents };
