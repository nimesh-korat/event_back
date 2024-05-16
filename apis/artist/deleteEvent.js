const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function DeleteEvent(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection('events');

        const session = req.userData.decodedToken.user;
        if (!session) {
            return res.status(401).json({ success: false, message: "Unauthorized access!" });
        }

        const { eventId } = req.body;
        const artistId = session._id;

        const event = await collection.findOne({ _id: new ObjectId(eventId), artistId: new ObjectId(artistId) });

        if (!event) {
            return res.status(400).json({ success: false, message: "Event not found!" });
        }

        if (event.totalSeats !== event.availableSeats) {
            return res.status(400).json({ success: false, message: "Cannot delete event with existing bookings!" });
        }

        await collection.deleteOne({ _id: new ObjectId(eventId), artistId: new ObjectId(artistId) });

        return res.status(200).json({ success: true, message: "Event Deleted Successfully" });
    } catch (error) {
        console.error("DeleteEvent.js:", error);
        return res.status(500).json({ success: false, error: "Something went wrong!!!" });
    }
}

module.exports = { DeleteEvent };
