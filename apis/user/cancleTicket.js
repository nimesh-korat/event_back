const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function CancleTicket(req, res) {
    try {
        const db = await connectDB();

        const bookingsCollection = db.collection("bookings");
        const eventCollection = db.collection("events");
        const { bookingId, seats, eventId } = req.body;
        if (!bookingId || !seats || !eventId) {
            return res
                .status(400)
                .json({ success: false, message: "Missing required fields!" });
        }

        const session = req.userData.decodedToken.user;
        if (!session) {
            return res
                .status(401)
                .json({ success: false, message: "Unauthorized access!" });
        }

        const userId = session._id;

        const isBookingExist = await bookingsCollection.findOne({
            _id: new ObjectId(bookingId),
            userId: new ObjectId(userId),
        });

        if (!isBookingExist) {
            return res
                .status(404)
                .json({ success: false, message: "Booking not found!" });
        } else if (isBookingExist.status === "Cancelled") {
            return res
                .status(400)
                .json({ success: false, message: "Ticket already cancelled!" });
        }

        await bookingsCollection.updateOne(
            {
                _id: new ObjectId(bookingId),
                userId: new ObjectId(userId),
            },
            {
                $set: {
                    status: "Cancelled",
                },
            }
        );

        await eventCollection.updateOne(
            {
                _id: new ObjectId(eventId),
            },
            {
                $inc: {
                    availableSeats: parseInt(seats),
                },
            }
        );


        return res
            .status(201)
            .json({ success: true, message: "Booking cancelled successfully" });
    } catch (error) {
        console.error("CancleTicket.js:", error);
        return res
            .status(500)
            .json({ success: false, error: "Something went wrong!" });
    }
}

module.exports = { CancleTicket };
