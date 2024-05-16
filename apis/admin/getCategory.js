const connectDB = require("../../db/dbConnect");

async function GetCategories(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection('categories');

        const categories = await collection.find({}).toArray();

        if (!categories) {
            return res.status(401).json({ success: false, message: "No categories found" });
        }

        res.status(200)
            .json({ categories, success: true, message: "Category found successfully" });
    } catch (error) {
        console.log("getCategory.js", error);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
}

module.exports = { GetCategories };