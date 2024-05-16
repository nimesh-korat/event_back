const connectDB = require("../../db/dbConnect");

async function GetArtists(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection('users');

        const userData = req.userData.user;

        const artists = await collection.find({ role: "1" }, { projection: { password: 0, role: 0 } }).toArray();

        if (!artists) {
            return res.status(401).json({ success: false, message: "No artists found" });
        }

        res.status(200)
            .json({ artists, success: true, message: "Artist found successfully" });
    } catch (error) {
        console.log("getArtist.js", error);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
}

module.exports = { GetArtists };