const connectDB = require("../../db/dbConnect");

async function GetDailyProfit(req, res) {
    try {
        const db = await connectDB();
        const bookings = await db.collection('bookings').find().toArray();

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

        res.status(200).json({
            dailyProfit,
            totalBooking,
            totalProfit,
            success: true,
            message: "Daily profit data found successfully"
        });

    } catch (error) {
        console.log("GetDailyProfit.js", error);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
}

module.exports = { GetDailyProfit };
