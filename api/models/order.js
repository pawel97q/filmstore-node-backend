const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    film_id: String,
    count: Number
});

module.exports = mongoose.model("Order", orderSchema);