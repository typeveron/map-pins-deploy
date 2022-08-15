const express = require("express");

const app = express();
const PORT = process.env.PORT || 8500
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/error");
const cors = require("cors");

//setting cors
// const corsOptions = {
//     origin: 'https://map-pins.netlify.app',
//     preflightContinue:false,
//     credentials: true,
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   }



//Import Routes
const Routes = require('./routes/routes');

dotenv.config();



//middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use("/api", Routes);


//welcome message 
app.get('/', (req,res) => {
    console.log("Welcome to the API.")
});



app.get('/greeting', (req,res) => {
    res.json({greeting: 'Hello there'})
});


mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log("MongoDB Connected")
})
.catch((err) => console.log(err));



app.listen(PORT, ()=> {
    console.log("Backend server is running!")
})