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
    image: {  // Changed from imageUrl to image
        type: String,
        required: true,
    },
    likeCount: {
        type: Number,
        default: 0,
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    }],
    
    videoUrl: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });
const Gallery = mongoose.model("Gallery", gallerySchema);
export default Gallery;