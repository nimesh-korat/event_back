const connectDB = require("../../db/dbConnect");
const { ObjectId } = require("mongodb");

async function GetTodaysEventsArtist(req, res) {
    try {
        const db = await connectDB();

        const session = req.userData.decodedToken.user;
        const artistId = session._id;
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];

        // Find events with a datetime equal to today
        const events = await db.collection('events').find({ artistId: new ObjectId(artistId), datetime: { $gte: new Date(today), $lt: new Date(today + 'T23:59:59.999Z') } }).toArray();

        res.status(200).json({
            todayEvents: events,
            success: true,
            message: "Today's events found successfully"
        });

    } catch (error) {
        console.log("GetTodaysEventsArtist.js", error);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
}

module.exports = { GetTodaysEventsArtist };
