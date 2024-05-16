const connectDB = require("../db/dbConnect");

async function SignUpApi(req, res) { 
    try {
        const db = await connectDB();
        const collection = db.collection('users');

        const { name, email, role, phoneNo, address, password, experiance, category } = req.body;
        const profilePic = req.file.filename;

        if (!name || !email || !role || !phoneNo || !address || !password || !profilePic) {
            return res.status(400).json({ success: false, message: "Missing required fields!" });
        }

        if (role === '1') {
            if (!experiance || !category) {

                return res.status(400).json({ success: false, message: "Missing required fields!" });
            }
        }

        const userExist = await collection.findOne({ email });
        if (userExist) {
            return res
                .status(400)
                .json({ success: false, message: "Email Already Exist!" });
        }

        if (role === "1") {
            await collection.insertOne({
                name,
                email,
                profilePic,
                role,
                phoneNo,
                address,
                experiance,
                category,
                password
            });
            return res
                .status(201)
                .json({ success: true, message: "Artist registered successfully" });
        }

        await collection.insertOne({
            name,
            email,
            profilePic,
            role,
            phoneNo,
            address,
            password
        });

        return res
            .status(201)
            .json({ success: true, message: "Registration Successful" });

    } catch (error) {
        console.error("Registration Failed:", error);
        return res.status(500).json({ success: false, error: "Registration Failed" });
    }
}

module.exports = { SignUpApi };