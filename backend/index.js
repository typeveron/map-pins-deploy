const express = require("express");

const app = express();
const PORT = process.env.PORT || 8500
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/error");
const path = require('path');


//Import Routes
const Routes = require('./routes/routes');

dotenv.config();

app.use(express.json())

//Welcome message 
app.get('/', (req,res) => res.send('Welcome to our API'));

app.get('/greeting', (req,res) => {
    res.json({greeting: 'Hello there'})
});

app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/client/build/index.html'))
  })


mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
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


app.listen(PORT, ()=> {
    console.log("Backend server is running!")
})