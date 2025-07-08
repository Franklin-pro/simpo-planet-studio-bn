import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Artist",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });
const Gallery = mongoose.model("Gallery", gallerySchema);
export default Gallery;