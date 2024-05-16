const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function BookEvent(req, res) {
    try {
        const db = await connectDB();
        const eventsCollection = db.collection('events');
        const bookingsCollection = db.collection('bookings');
        const paymentsCollection = db.collection('payments');

        const { eventId, seats } = req.body;

        const session = req.userData.decodedToken.user;
        if (!session) {
            return res.status(401).json({ success: false, message: "Unauthorized access!" });
        }
        const userId = session._id;

        if (!eventId || !userId || !seats || isNaN(seats)) {
            return res.status(400).json({ success: false, message: "Missing required fields!" });
        }

        const event = await eventsCollection.findOne({ _id: new ObjectId(eventId) });

        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found!" });
        }

        if (event.availableSeats <= 0 || parseInt(seats) <= 0) {
            return res.status(400).json({ success: false, message: "No seats available!" });
        }

        if (event.availableSeats < parseInt(seats)) {
            return res.status(400).json({ success: false, message: "Not enough seats available!" });
        }

        const booking = {
            eventId: new ObjectId(eventId),
            userId: new ObjectId(userId),
            seats: parseInt(seats),
            totalPrice: event.pricePerSeat * parseInt(seats),
            date: new Date(),
            status: 'Booked'
        };

        const result = await bookingsCollection.insertOne(booking);

        await eventsCollection.updateOne({ _id: new ObjectId(eventId) }, { $inc: { availableSeats: -parseInt(seats) } });

        const payment = {
            bookingId: new ObjectId(result.insertedId),
            userId: new ObjectId(userId),
            artistId: new ObjectId(event.artistId),
            payments: parseInt(seats) * event.pricePerSeat,
            date: new Date(),
            status: 'success'
        }

        await paymentsCollection.insertOne(payment);

        return res.status(201).json({ success: true, message: "Event booked successfully", bookingId: result.insertedId });

    } catch (error) {
        console.error("BookEvent.js:", error);
        return res.status(500).json({ success: false, error: "Something went wrong!" });
    }
}

module.exports = { BookEvent };
