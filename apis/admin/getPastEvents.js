const connectDB = require("../../db/dbConnect");

async function GetPastEvents(req, res) {
    try {
        const db = await connectDB();
        const eventsCollection = db.collection('events');
        const bookingsCollection = db.collection('bookings');

        const currentDate = new Date();
        const pastEvents = await eventsCollection.aggregate([
            { $match: { datetime: { $lt: currentDate } } },
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

        return res.status(200).json({ success: true, pastEvents });
    } catch (error) {
        console.error("GetPastEvents.js:", error);
        return res.status(500).json({ success: false, error: "Something went wrong!" });
    }
}

module.exports = { GetPastEvents };
