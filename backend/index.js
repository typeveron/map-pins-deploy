const express = require("express");

const app = express();
const PORT = process.env.PORT || 8800
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/error");

//Import Routes
const Routes = require('./routes/routes');

dotenv.config();

app.use(express.json())

mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URL, {useNewUrlParser: true}).then(() => {
    console.log("MongoDB Connected")
})
.catch((err) => console.log(err));

//middleware
app.use(express.json());
app.use(helmet());
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors());
app.use("/api", Routes);

//Error Middleware
app.use(errorHandler);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('frontend/build'));
}

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'addyourpins', 'build', 'index.html'));
});

app.listen(PORT, ()=> {
    console.log("Backend server is running!")
})