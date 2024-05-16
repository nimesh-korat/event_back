const connectDB = require("../../db/dbConnect");

async function GetPayments(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection("payments");

        const payments = await collection.find({}).toArray();

        if (!payments) {
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

module.exports = { GetPayments };
