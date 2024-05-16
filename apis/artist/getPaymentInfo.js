const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function GetPaymentsArtist(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection("payments");
        const session = req.userData.decodedToken.user;

        if (!session) {
            return res
                .status(401)
                .json({ success: false, message: "Unauthorized access" });
        }

        const artistId = session._id;

        const payments = await collection.find({ artistId: new ObjectId(artistId) }).toArray();

        if (payments.length === 0) {
            return res
                .status(401)
                .json({ success: false, message: "No payments found" });
        }

        res
            .status(200)
            .json({ payments, success: true, message: "Payments found successfully" });
    } catch (error) {
        console.log("getPayment.js", error);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
}

module.exports = { GetPaymentsArtist };
