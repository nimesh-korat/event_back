const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function ArtistGetBooking(req, res) {
    try {
        const db = await connectDB();
        const bookingsCollection = db.collection('bookings');
        const eventsCollection = db.collection('events');

        // Get the artist ID from the session
        const session = req.userData.decodedToken.user;
        if (!session) {
            return res.status(401).json({ success: false, message: "Unauthorized access!" });
        }

        const artistId = await session._id;

        // Find the events associated with the artist
        const events = await eventsCollection.find({ artistId: new ObjectId(artistId) }).toArray();

        if (!events) {
            return res.status(401).json({ success: false, message: "No events found for the artist" });
        }

        // Get the event IDs
        const eventIds = events.map(event => new ObjectId(event._id));

        // Find the bookings associated with the event IDs
        const bookings = await bookingsCollection.find({ eventId: { $in: eventIds } }).toArray();

        if (bookings.length === 0) {
            return res.status(401).json({ success: false, message: "No bookings found for the artist" });
        }

        res.status(200)
            .json({ bookings, success: true, message: "Bookings found successfully" });

    } catch (error) {
        console.log("ArtistgetBooking.js", error);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
}

module.exports = { ArtistGetBooking };
