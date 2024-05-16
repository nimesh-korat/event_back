const multer = require("multer");

//profile pic storage
const profilePicStorage = multer.diskStorage({

    //path to store the profilePic
    destination: (req, file, cb) => {
        cb(null, "./images/profilePics");
    },

    //filename to give to the profilePic
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }

});

const profilePicUpload = multer({ storage: profilePicStorage });

//event pic storage
const eventPicStorage = multer.diskStorage({

    //path to store the eventPic
    destination: (req, file, cb) => {
        cb(null, "./images/eventPics");
    },

    //filename to give to the eventPic
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }

});

const eventPicUpload = multer({ storage: eventPicStorage });

module.exports = { profilePicUpload, eventPicUpload }