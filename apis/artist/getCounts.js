const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function ArtistGetCounts(req, res) {
    try {
        const db = await connectDB();

        const session = req.userData.decodedToken.user;
        if (!session) {
            return res.status(401).json({ success: false, message: "Unauthorized access" });
        }

        const artistId = new ObjectId(session._id);

        // Find events created by the artist
        const events = await db.collection('events').find({ artistId }).toArray();
        const eventIds = events.map(event => event._id);

        // Find bookings associated with the events
        const bookingCount = await db.collection('bookings').countDocuments({ eventId: { $in: eventIds } });

        const counts = {
            eventCounts: events.length,
            bookingCount
        }

        res.status(200)
            .json({ counts, success: true, message: "Counts found successfully" });

    } catch (error) {
        console.log("ArtistGetCounts.js", error);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
}

module.exports = { ArtistGetCounts };
