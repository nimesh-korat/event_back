const connectDB = require("../../db/dbConnect");

async function GetBooking(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection('bookings');

        const booking = await collection.find().toArray();

        if (!booking) {
            return res.status(401).json({ success: false, message: "No booking found" });
        }

        res.status(200)
            .json({ booking, success: true, message: "booking found successfully" });

    } catch (error) {
        console.log("getBooking.js", error);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
}

module.exports = { GetBooking };