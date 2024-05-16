const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function GetDailyProfitArtist(req, res) {
    try {
        const db = await connectDB();
        const artistId = req.userData.decodedToken.user._id;

        // Step 1: Get all eventIds for the artist from the events collection
        const events = await db.collection('events').find({ artistId: new ObjectId(artistId) }).toArray();
        if (events.length === 0) {
            return res.status(404).json({ success: false, message: "No events found for the artist" });
        }

        const eventIds = events.map(event => event._id);

        // Step 2: Find all bookings in the bookings collection where the eventId matches
        const bookings = await db.collection('bookings').find({ eventId: { $in: eventIds } }).toArray();

        // Step 3: Calculate daily profit based on filtered bookings
        const dailySales = {};
        let totalBooking = 0;
        let totalProfit = 0;

        bookings.forEach(booking => {
            const date = booking.date.toISOString().split('T')[0];
            if (!dailySales[date]) {
                dailySales[date] = 0;
            }
            dailySales[date] += booking.totalPrice;

            totalBooking++;
            totalProfit += booking.totalPrice;
        });

        const dailyProfit = Object.keys(dailySales).map(date => ({
            date,
            sales: dailySales[date]
        }));

        // Step 4: Return the daily profit data

        if (dailyProfit.length === 0) {
            return res.status(404).json({ success: false, message: "No daily profit data found" });
        }

        res.status(200).json({
            dailyProfit,
            totalBooking,
            totalProfit,
            success: true,
            message: "Daily profit data found successfully"
        });

    } catch (error) {
        console.log("GetDailyProfitArtist.js", error);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
}

module.exports = { GetDailyProfitArtist };
