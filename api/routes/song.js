const express = require("express");
const mongoose = require("mongoose");
const messages = require("../../messages/messages");
const router = express.Router();
const Song = require("../models/song");

router.get("/", (req,res,next) => {
    res.json({
        message: messages.song_get 
    });
});

router.post("/", (req,res,next) => {

    Song.find({
        title: req.body.title, 
        artist: req.body.artist
    })
    .populate("song", "title artist")
    .exec()
    .then(result => {
        console.log(result);
        if(result.length > 0){
            return res.status(406).json({
                message: messages.song_dup_post
            })
        }
        const newSong = new Song({
            _id: mongoose.Types.ObjectId(),
            title: req.body.title,
            artist: req.body.artist
        });
    
        newSong.save()
            .populate("song", "title artist")
            .then(result => {
                console.log(result);
                res.status(200).json({
                    message: messages.song_saved,
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
                        message: messages.song_not_saved
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
        .populate("song", "title artist")
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: messages.song_get_byID,
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
    .populate("song", "title artist")
    .then(result => {
        res.status(200).json({
            message: messages.song_update_byID,
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
    })
    .populate("song", "title artist")
    .then(result => {
        res.status(200).json({
            message: messages.song_deleted,
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