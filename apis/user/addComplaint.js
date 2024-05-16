const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function AddComplaint(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection('complaints');

        const { artistId, bookingId, subject, message } = req.body;

        if (!artistId || !bookingId || !subject || !message) {
            return res.status(400).json({ success: false, message: "Missing required fields!" });
        }



        const session = await req.userData.decodedToken.user;
        if (!session) {
            return res.status(401).json({ success: false, message: "Unauthorized Access" });
        }
        const userId = await session._id;
        const isComplaintExist = await collection.findOne({
            artistId: new ObjectId(artistId),
            bookingId: new ObjectId(bookingId),
            userId: new ObjectId(userId),
        })

        if (isComplaintExist) {
            return res.status(400).json({ success: false, message: "Complaint already exist" });
        }

        await collection.insertOne({
            artistId: new ObjectId(artistId),
            bookingId: new ObjectId(bookingId),
            userId: new ObjectId(userId),
            subject,
            message,
            status: 'pending',
            timestamp: new Date(),
        });

        return res
            .status(201)
            .json({ success: true, message: "Complaint added successfully" });

    } catch (error) {
        console.error("AddComplaint.js: ", error);
        return res.status(500).json({ success: false, error: "something went wrong" });
    }
}

module.exports = { AddComplaint };