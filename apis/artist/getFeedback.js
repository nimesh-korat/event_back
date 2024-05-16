const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function ArtistGetFeedback(req, res) {
    try {
        const db = await connectDB();
        const feedbackCollection = db.collection('complaints');
        const eventsCollection = db.collection('events');

        // Get the artist ID from the session
        const session = req.userData.decodedToken.user;
        if (!session) {
            return res.status(401).json({ success: false, message: "Unauthorized access!" });
        }

        const artistId = await session._id;

        // // Find the events associated with the artist
        // const events = await eventsCollection.find({ artistId: new ObjectId(artistId) }).toArray();

        // if (!events) {
        //     return res.status(401).json({ success: false, message: "No events found for the artist" });
        // }

        // // Get the event IDs
        // const eventIds = events.map(event => new ObjectId(event._id));

        // Find the feedback associated with the event IDs
        const feedback = await feedbackCollection.find({ artistId: new ObjectId(artistId) }).toArray();

        if (feedback.length === 0) {
            return res.status(401).json({ success: false, message: "No feedback found for the artist" });
        }

        res.status(200)
            .json({ feedback, success: true, message: "feedback found successfully" });

    } catch (error) {
        console.log("ArtistgetFeedback.js", error);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
}

module.exports = { ArtistGetFeedback };
