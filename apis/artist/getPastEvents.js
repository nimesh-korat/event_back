const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function ArtistGetPastEvents(req, res) {
    try {
        const db = await connectDB();
        const eventsCollection = db.collection('events');
        const bookingsCollection = db.collection('bookings');

        const session = req.userData.decodedToken.user;
        if (!session) {
            return res.status(401).json({ success: false, message: "Unauthorized access!" });
        };

        const artistId = await req.userData.decodedToken.user._id;

        const currentDate = new Date();
        const pastEvents = await eventsCollection.aggregate([
            { $match: { artistId: new ObjectId(artistId), datetime: { $lt: currentDate } } },
            {
                $lookup: {
                    from: "bookings",
                    localField: "_id",
                    foreignField: "eventId",
                    as: "bookings"
                }
            },
            {
                $addFields: {
                    totalBookedSeats: { $sum: "$bookings.seats" }
                }
            },
            {
                $project: {
                    bookings: 0 // Exclude the bookings array from the result
                }
            }
        ]).toArray();

        return res.status(200).json({ pastEvents, success: true });
    } catch (error) {
        console.error("ArtistGetPastEvents.js:", error);
        return res.status(500).json({ success: false, error: "Something went wrong!" });
    }
}

module.exports = { ArtistGetPastEvents };
