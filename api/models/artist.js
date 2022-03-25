const mongoose = require("mongoose");

const artistSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song",  
        required: true
    },
    artist: {
        type: String, 
        required: true
    }
});

module.exports = mongoose.model("Artist", artistSchema);