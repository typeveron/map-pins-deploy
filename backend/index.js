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


//Import Routes
const Routes = require('./routes/routes');

dotenv.config();



//middleware
app.use(
    cors({
      origin: [
        "http://localhost:3000",
        "https://map-pins.netlify.app",
      ],
      credentials: true,
    })
  );


  
app.use(express.json());
app.use(helmet());
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use("/api", Routes);


//welcome message 
app.get('/', (req,res) => {
    res.json("Welcome to the API.");
});



app.get('/greeting', (req,res) => {
    res.json({greeting: 'Hello there'});
});


mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => console.log(err));



app.listen(PORT, ()=> {
    console.log("Backend server is running!");
})