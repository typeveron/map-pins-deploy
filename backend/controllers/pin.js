const Pin = require("../models/Pin");
const router = require("express").Router();


exports.createPin = async (req, res, next) => {
    const newPin = new Pin(req.body);
    try {
        const savePin = await newPin.save();
        res.status(200).json(savePin);
    } catch(error) {
        next(error);
    }
}

exports.getPins = async (req, res, next) => {
        try {
            const pins = await Pin.find();
            res.status(200).json(pins);
          } catch (error) {
            next(error);
          }
        }
