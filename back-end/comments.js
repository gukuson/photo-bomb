const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();
const users = require("./users.js");
const User = users.model;
const validUser = users.valid;
const photos = require("./photos.js");
const Photo = photos.model;

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    photo: {
        type: mongoose.Schema.ObjectId,
        ref: 'Photo'
    },
    comment: String,
    created: {
        type: Date,
        default: Date.now
    },
});

const Comment = mongoose.model('Comment', commentSchema);

//create a comment if signed in
router.post("/:photoID", validUser, async(req, res) => {
    try {
        let photo = await Photo.findOne({ _id: req.params.photoID });
        let comment = new Comment({
            comment: req.body.comment,
            user: req.user,
            photo: photo,
        });
        await comment.save();
        return res.send(comment);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

//get comments for a photo
router.get("/:photoID", async(req, res) => {
    try {
        let photo = await Photo.findOne({ _id: req.params.photoID });
        let comments = await Comment.find({
            photo: photo
        }).populate('user');
        return res.send(comments);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

module.exports = {
    model: Comment,
    routes: router,
}