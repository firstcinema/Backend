require('dotenv').config();
const keys = require("./config/keys");
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
const passport = require("passport");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const app = express();


// MiddleWare
app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true
}));

app.use(bodyParser.json());

// Cookies
app.use(cookieSession({
    keys: [keys.session.cookieKey],
    maxAge: 24 * 60 * 60 * 1000
}));


// Passport
app.use(passport.initialize());
app.use(passport.session());

require("./config/passport")(passport);


// Mongoose
mongoose.connect(keys.mongodb.dbURI, {
    useCreateIndex: true,
    useNewUrlParser: true
});

mongoose.connection.on("connected", () => {
    console.log(`Cinema: Successfully connected to database ${keys.mongodb.dbURI}`);
});

mongoose.connection.on("error", err => {
    console.log(`Cinema: Error Occurred ${err}`);
});

// Routes
const { userRoute, authRoute, mailRoute } = require('./routes');

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use('/api/mail', mailRoute);


// Express
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Cinema: Server started on port ${port}`));