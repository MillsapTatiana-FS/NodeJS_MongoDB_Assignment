const mongoose = require("mongoose");

const songSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    song: {type: String,  required: true},
    artist: {type: String, required: true}
});

module.exports = mongoose.model("Song", songSchema);