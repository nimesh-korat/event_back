const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function GetBookingHistory(req, res) {
    try {
        const db = await connectDB();
        const bookingsCollection = db.collection("bookings");
        const eventsCollection = db.collection("events");

        const session = req.userData.decodedToken.user;
        // if (!session) {
        //     return res
        //         .status(401)
        //         .json({ success: false, message: "Unauthorized access!" });
        // }

        const userId = session._id;

        const bookings = await bookingsCollection
            .find({ userId: new ObjectId(userId) })
            .toArray();

        if (bookings.length === 0) {
            return res
                .status(401)
                .json({ success: false, message: "No booking found" });
        }

        // Map each booking to include the eventName
        const bookingsWithEventName = await Promise.all(
            bookings.map(async (booking) => {
                const event = await eventsCollection.findOne({
                    _id: new ObjectId(booking.eventId),
                });
                return {
                    ...booking,
                    eventName: event ? event.eventName : "Event name not available",
                    eventAddress: event ? event.address : "Event address not available",
                    eventDatetime: event ? event.datetime : "Event datetime not available",
                    eventArtistId: event ? event.artistId : "Event artist not available",
                };
            })
        );

        res
            .status(200)
            .json({
                bookings: bookingsWithEventName,
                success: true,
                message: "Booking history found successfully",
            });
    } catch (error) {
        console.log("GetBookingHistory.js", error);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
}

module.exports = { GetBookingHistory };
