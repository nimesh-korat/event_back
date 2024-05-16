const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function EditEvent(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection('events');

        const session = req.userData.decodedToken.user;
        if (!session) {
            return res.status(401).json({ success: false, message: "Unauthorized access!" });
        }

        const { eventId, eventName, category, pricePerSeat, totalSeats, address, datetime } = req.body;
        const eventPic = req.file.filename;

        if (!eventId || !eventName || !category || !pricePerSeat || !totalSeats || !address || !datetime || !eventPic) {
            return res.status(400).json({ success: false, message: "Missing required fields!" });
        }

        const artistId = session._id;
        const intPricePerSeat = parseInt(pricePerSeat);
        const intTotalSeats = parseInt(totalSeats);

        const event = await collection.findOne({ _id: new ObjectId(eventId), artistId: new ObjectId(artistId) });

        if (!event) {
            return res.status(400).json({ success: false, message: "Event not found!" });
        }

        const updatedAvailableSeats = event.availableSeats + (intTotalSeats - event.totalSeats);

        if (updatedAvailableSeats < 0) {
            return res.status(400).json({ success: false, message: "Available seats cannot be less than available seats" });
        }

        await collection.updateOne(
            { _id: new ObjectId(eventId), artistId: new ObjectId(artistId) },
            {
                $set: {
                    eventName,
                    eventPic,
                    category,
                    pricePerSeat: intPricePerSeat,
                    totalSeats: intTotalSeats,
                    availableSeats: updatedAvailableSeats,
                    address,
                    datetime: new Date(datetime),
                }
            }
        );

        return res.status(200).json({ success: true, message: "Event Updated Successfully" });
    } catch (error) {
        console.error("EditEvent.js:", error);
        return res.status(500).json({ success: false, message: "Something went wrong!!!" });
    }
}

module.exports = { EditEvent };