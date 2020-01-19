const mongoose = require("mongoose");

const filmSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: String,
    price: Number,
    filmImg: String
});

module.exports = mongoose.model("Film", filmSchema);

