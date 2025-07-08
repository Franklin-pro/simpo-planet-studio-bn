import mongoose from "mongoose";

const musicSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Artist",
        required: true,
    },
    album: {
        type: String,
        required: false,
    },
    genre: {
        type: String,
        required: true,
    },
    releaseDate: {
        type: Date,
        required: true,
    },
    duration: {
        type: Number, // Duration in seconds
        required: true,
    },
    coverImageUrl: {
        type: String,
        required: true,
    },
    audioFileUrl: {
        type: String,
        required: true,
    },
    lyrics: {
        type: String,
        required: false, // Optional field
    },
}, { timestamps: true });
const Music = mongoose.model("Music", musicSchema);
export default Music;