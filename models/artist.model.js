import mongoose from "mongoose";


const artistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    management:{
        type: String,
        required: true,
    },
    age:{
        type: String,
        required: true,
    },
    bio: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    socialLinks: {
        type: Map,
        of: String,
    },
    }, { timestamps: true });
const Artist = mongoose.model("Artist", artistSchema);
export default Artist;