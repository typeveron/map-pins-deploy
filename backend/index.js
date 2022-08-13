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

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });


//Import Routes
const Routes = require('./routes/routes');

dotenv.config();

app.use(express.json())

//Welcome message 
app.get('/', (req,res) => res.send('Welcome to our API'));

app.get('/greeting', (req,res) => {
    res.json({greeting: 'Hello there'})
});



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
app.use("/api", Routes);

//Error Middleware
app.use(errorHandler);


app.listen(PORT, ()=> {
    console.log("Backend server is running!")
})