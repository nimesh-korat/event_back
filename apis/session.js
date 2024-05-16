const jwt = require('jsonwebtoken');
// const { ObjectId } = require('mongodb');

async function Session(req, res) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'your-secret-key');
        const userDatas = decodedToken.user;

        if (!token || !userDatas) {
            return res.status(401).json({ message: "No token created!" });

        } else {
            res.status(200)
                .json({ sessionData: userDatas, success: true, message: "got Successful" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = Session;

// const jwt = require('jsonwebtoken');
// const { ObjectId } = require('mongodb');

// async function Session(req, res) {
//     try {
//         const token = req.headers.authorization.split(' ')[1];
//         const decodedToken = jwt.verify(token, 'your-secret-key');

//         console.log(decodedToken);
//         const userId = decodedToken._id;
//         console.log(userId);

//         if (!userId) {
//             return res.status(401).json({ message: "No session created!" });
//         } else {
//             const db = await connectDB();
//             const collection = db.collection('users');
//             const user = await collection.findOne({ _id: new ObjectId.createFromHexString(userId) });

//             res.status(200).json({ userData: user, success: true, message: "Session data retrieved successfully" });
//         }
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: error.message });
//     }
// }

// module.exports = Session;