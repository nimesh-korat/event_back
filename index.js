const express = require("express");
const connectDB = require("./db/dbConnect");
const cors = require("cors");
const { SignUpApi } = require("./apis/registerApi");
const { LoginApi } = require("./apis/loginApi");
const session = require("express-session");
const { GetUsers } = require("./apis/admin/getUser");
const { GetArtists } = require("./apis/admin/getArtist");
const { GetCategories } = require("./apis/admin/getCategory");
const Logout = require("./apis/logout");
const Session = require("./apis/session");
const { profilePicUpload, eventPicUpload } = require("./multer/multerUpload");
const { AddEvents } = require("./apis/artist/addEvents");
const { BookEvent } = require("./apis/user/bookEvent");
const { GetUpcomingEvents } = require("./apis/admin/getUpcomingEvents");
const { GetPastEvents } = require("./apis/admin/getPastEvents");
const { AddFeedBack } = require("./apis/user/addFeedback");
const { GetFeedback } = require("./apis/admin/getFeedback");
const { AddComplaint } = require("./apis/user/addComplaint");
const { GetComplaint } = require("./apis/admin/getComplaint");
const { GetBooking } = require("./apis/admin/getBooking");
const { GetPayments } = require("./apis/admin/getPayment");
const { GetCounts } = require("./apis/admin/getCounts");
const { GetDailyProfit } = require("./apis/admin/getDailyProfit");
const { GetTodaysEvents } = require("./apis/admin/getTodaysEvents");
const { ArtistGetUpcomingEvents } = require("./apis/artist/getUpcomingEvents");
const { ArtistGetPastEvents } = require("./apis/artist/getPastEvents");
const { ArtistGetBooking } = require("./apis/artist/getBookings");
const { ArtistGetFeedback } = require("./apis/artist/getFeedback");
const { EditEvent } = require("./apis/artist/editEvent");
const { DeleteEvent } = require("./apis/artist/deleteEvent");
const { GetProfile } = require("./apis/artist/getProfile");
const { EditProfile } = require("./apis/artist/editProfile");
const { ArtistGetCounts } = require("./apis/artist/getCounts");
const { GetBookingHistory } = require("./apis/user/getBookingHistory");
const { CancleTicket } = require("./apis/user/cancleTicket");
const { GetPaymentsArtist } = require("./apis/artist/getPaymentInfo");
const { GetDailyProfitArtist } = require("./apis/artist/getDailyProfitArtist");
const { GetTodaysEventsArtist } = require("./apis/artist/getTodayEvent");
const checkAuth = require('./middleware/auth');
require('dotenv').config();

//initialize app
const app = express();

//initialize PORT No
const PORT = process.env.PORT || 8001;

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin: ["http://localhost:3001", "http://localhost:3002", "http://localhost:3003", process.env.CLIENT_URL_1, process.env.CLIENT_URL_2],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
}));

// Configure express-session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

app.use("/images/profilePics", express.static("images/profilePics"));
app.use("/images/eventPics", express.static("images/eventPics"));

//callback to connect MongoDB
connectDB();

//Routes
//!admin
app.get("/admin/getUser", checkAuth, GetUsers);
app.get("/admin/getArtist", checkAuth, GetArtists);
app.get("/admin/getUpcomingEvents", GetUpcomingEvents);
app.get("/admin/getPastEvents", checkAuth, GetPastEvents);
app.get("/admin/getFeedback", checkAuth, GetFeedback);
app.get("/admin/getComplaint", checkAuth, GetComplaint);
app.get("/admin/getBooking", checkAuth, GetBooking);
app.get("/admin/getPayment", checkAuth, GetPayments);
app.get("/admin/getCounts", checkAuth, GetCounts);
app.get("/admin/getDailyProfit", checkAuth, GetDailyProfit);
app.get("/admin/getTodaysEvents", checkAuth, GetTodaysEvents);

//!artist
app.post("/artist/getCounts", checkAuth, ArtistGetCounts);
app.post("/artist/getTodayEvents", checkAuth, GetTodaysEventsArtist);
app.post("/artist/getProfile", checkAuth, GetProfile);
app.post("/artist/editProfile", checkAuth, profilePicUpload.single("profilePic"), EditProfile);
app.post("/artist/addEvent", checkAuth, eventPicUpload.single("eventPic"), AddEvents);
app.post("/artist/editEvent", checkAuth, eventPicUpload.single("eventPic"), EditEvent);
app.post("/artist/deleteEvent", checkAuth, DeleteEvent);
app.post("/artist/getUpcomingEvents", checkAuth, ArtistGetUpcomingEvents);
app.post("/artist/getPastEvents", checkAuth, ArtistGetPastEvents);
app.post("/artist/getBookings", checkAuth, ArtistGetBooking);
app.post("/artist/getFeedback", checkAuth, ArtistGetFeedback);
app.post("/artist/getPayments", checkAuth, GetPaymentsArtist);
app.post("/artist/getDailyProfitArtist", checkAuth, GetDailyProfitArtist);

//!user 
app.post("/user/bookEvent", checkAuth, BookEvent);
app.post("/user/addFeedback", checkAuth, AddFeedBack);
app.post("/user/addComplaint", checkAuth, AddComplaint);
app.get("/user/getBookingHistory", checkAuth, GetBookingHistory);
app.post("/user/cancelTicket", checkAuth, CancleTicket);
app.post("/register", profilePicUpload.single("profilePic"), SignUpApi);
app.post("/login", LoginApi);
app.post("/session", checkAuth, Session);
app.post("/logout", Logout);

//!common
app.get("/getCategories", GetCategories)

//Activate Server
app.listen(PORT, () => {
    console.log("Server Started on port: ", PORT);
});
