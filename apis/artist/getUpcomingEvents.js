const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function ArtistGetUpcomingEvents(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection('events');

        const session = req.userData.decodedToken.user;
        if (!session) {
            return res.status(401).json({ success: false, message: "Unauthorized access!" });
        };

        const artistId = await req.userData.decodedToken.user._id;

        const currentDate = new Date();
        const upcomingEvents = await collection.find({ artistId: new ObjectId(artistId), datetime: { $gte: currentDate } }).toArray();

        if (upcomingEvents.length === 0) {
            return res.status(401).json({ success: false, message: "No upcoming events found!" });
        }

        return res.status(200).json({ upcomingEvents, success: true });
    } catch (error) {
        console.error("ArtistGetUpcomingEvents.js:", error);
        return res.status(500).json({ success: false, error: "Something went wrong!" });
    }
}

module.exports = { ArtistGetUpcomingEvents };
