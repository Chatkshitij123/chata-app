//video 25
const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
    //configuration for schema
    sender: {
        //we are going to store the reference//basically store the document id of that user
        type: mongoose.Schema.ObjectId,
        ref: "User",//by passing ref we are actually allowed to populate on this field
    },
    recipient: {
        type: mongoose.Schema.ObjectId,
        ref: "User",//by passing ref we are actually allowed to populate on this field
    },
    createdAt: {
        type: Date,
        default: Date.now(),//time at this point
    }
});

//model is bascically a blue print on which me make queries

const FriendRequest = new mongoose.model("FriendRequest", requestSchema);

module.exports = FriendRequest;