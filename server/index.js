const keys = require("./config/keys");
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
const passport = require("passport");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

// Routes
const users = require("./routes/UserRoute");
const authentication = require("./routes/AuthRoute");

const app = express();


// MiddleWare
app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true
}));

app.use(bodyParser.json());

app.use(cookieSession({
    keys: [keys.session.cookieKey],
    maxAge: 24 * 60 * 60 * 1000
}));

app.use(passport.initialize());
app.use(passport.session());

require("./config/passport")(passport);

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

app.use("/api/users", users);
app.use("/api/auth", authentication);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Cinema: Server started on port ${port}`));