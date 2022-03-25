const express = require("express");
const artist = require("../models/artist");
const router = express.Router();
const mongoose = require("mongoose");

router.get("/", (req,res,next) => {
    res.json({
        message: "Artist - GET"
    });
});

router.post("/", (req,res,next) => {
    artist.find({
        title: req.body.title, 
        artist: req.body.artist
    })
    .exec()
    .then(result => {
        console.log(result);
        if(result.length > 0){
            return res.status(406).json({
                message: "Artist is already catalogued"
            })
        }
        const newArtist = new artist({
            _id: mongoose.Types.ObjectId(),
            title: req.body.title,
            artist: req.body.artist
        });
    
        newArtist.save()
            .then(result => {
                console.log(result);
                res.status(200).json({
                    message: "Artist Saved",
                    song: {
                        title: result.title,
                        artist: result.artist,
                        id: result._id,
                        metadata: {
                            method: req.method,
                            host: req.hostname
                        }
                    }
                })
            })
            .catch(err => {
                console.error(err.message);
                res.status(500).json({
                    error: {
                        message: "Unable to save Artist: + req.body.title"
                    }
                });
            });
        });
});


router.get("/:artistId", (req,res,next) => {
    const artistId = req.params.artistId;

    artist.findById({
        _id: artistId
    })
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: "Found Artist",
            song: {
                title: result.title, 
                artist: result.artist, 
                id: result._id
            },
            metadata: {
                host: req.hostname,
                method: req.method
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: {
                message: err.message
            }
        })
    })  
});

router.patch("/:artistId", (req,res,next) => {
    const artistId = req.params.artistId;
    
    const updatedArtist = {
        title: req.body.title,
        artist: req.body.artist
    };

    artist.findByIdAndUpdate({
        _id: artistId
    }, {
        $set: updatedArtist
    })
    .select("name _id")
    .populate("song", "title artist")
    .exec()
    .then(result => {
        res.status(200).json({
            message: "Updated Artist",
            song: {
                title: result.title, 
                author: result.author, 
                id: result._id
            },
            metadata: {
                host: req.hostname,
                method: req.method
            }
        })
        if(!artist){
            console.log(artist);
            return res.status(404).json({
             message: Messages.artist_not_found   
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            error: {
                message: err.message
            }
        })
    });
});

router.delete("/:artistId", (req,res,next) => {
    const artistId = req.params.artistId;

    const deletedArtist = {
        title: req.body.title,
        artist: req.body.artist
    };
    
    artist.findByIdAndDelete({
        _id: artistId
    }, {
        $set: deletedArtist
    })
    .select("name _id")
    .populate("song", "title artist")
    .exec()
    .then(result => {
        res.status(200).json({
            message: Messages.artist_deleted ,
            artist: {
                title: result.title, 
                artist: result.artist, 
                id: result._id
            },
            metadata: {
                host: req.hostname,
                method: req.method
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: {
                message: err.message
            }
        })
    })
});

module.exports = router;