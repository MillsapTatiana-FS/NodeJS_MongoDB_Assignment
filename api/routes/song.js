const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Song = require("../models/song");

router.get("/", (req,res,next) => {
    res.json({
        message: "Song - GET" 
    });
});

router.post("/", (req,res,next) => {

    Song.find({
        title: req.body.title, 
        artist: req.body.artist
    })
    .exec()
    .then(result => {
        console.log(result);
        if(result.length > 0){
            return res.status(406).json({
                message: "Song is alread cataloged"
            })
        }
        const newSong = new Song({
            _id: mongoose.Types.ObjectId(),
            title: req.body.title,
            artist: req.body.artist
        });
    
        newSong.save()
            .then(result => {
                console.log(result);
                res.status(200).json({
                    message: "Song Saved",
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
                        message: "Unable to save song with title:  + req.body.title"
                    }
                });
            });
        });
});

router.get("/:songId", (req,res,next) => {
    const songId = req.params.songId;

    Song.findById({
        _id: songId
        })
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "Found Song",
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


router.patch("/:songId", (req,res,next) => {
    const songId = req.params.songId;

    const updatedSong = {
        title: req.body.title,
        artist: req.body.artist
    };

    Song.updateOne({
        _id: songId
    }, {
        $set: updatedSong
    })
    .then(result => {
        res.status(200).json({
            message: "Updated Song",
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
    })
      .catch(err => {
          res.status(500).json({
              error: {
                  message: err.message
              }
          })
      });
});

router.delete("/:songId", (req,res,next) => {
    const songId = req.params.songId;
    
    const deletedSong = {
        title: req.body.title,
        artist: req.body.artist
    };

    Song.deleteOne({
        _id: songId
    }, {
        $set: deletedSong
    }).then(result => {
        res.status(200).json({
            message: "Deleted Song",
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
  });
});


module.exports = router;