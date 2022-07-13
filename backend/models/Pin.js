const mongoose = require("mongoose");

const PinSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
      },
    title: {
        type: String,
        required: [true, "Please add a title"],
        minlength: [3, "Title must have at least 3 characters."]
    },
    desc: {
        type: String,
        required: true,
        minlength: [3, "Description must have at least 3 characters."]
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
    },
    lat: {
        type: Number,
        require: true,
    },
    long: {
        type: Number,
        require: true,
    }
  },
{ timestamps: true }
);

module.exports = mongoose.model("Pin", PinSchema);