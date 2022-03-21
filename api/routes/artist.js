const express = require("express");
const artist = require("../models/artist");
const router = express.Router();

router.get("/", (req,res,next) => {
    res.json({
        message: "Artist - GET"
    });
});

router.post("/", (req,res,next) => {
    res.json({
        message: "Artist - POST"
    });
});

router.get("/:artistId", (req,res,next) => {
    const artistId = req.params.artistId;
    artist.findById(artistId)
    .select("name _id")
    .exec()
    .then(artist => {
        if(!artist){
            console.log(artist);
            return res.status(404).json({
             message: "Artist Not Found"   
            })
        }
        console.log(artist);
        res.status(201).json({
            artist: artist
        })
    })
    .catch(err => {
        res.status(500).json ({error: {
            message: err.message
        }})
    })
    
});

router.patch("/:artistId", (req,res,next) => {
    const artistId = req.params.artistId;
    res.json({
        message: "Artist - PATCH",
        id: artistId
    });
});

router.delete("/:artistId", (req,res,next) => {
    const artistId = req.params.artistId;
    
    artist.deleteOne({
        _id: artistId
    })
    .exec()
    .then(result => {
        res.status(200).json({
            message: "Artist deleted",
            request: {
                method: "GET",
                url: "http://localhost:3002/artist/" + artistId
            }
        })
    })
    .catch(err => {
        res.status(500).json({
        message: err.message
        })
    })
});

module.exports = router;