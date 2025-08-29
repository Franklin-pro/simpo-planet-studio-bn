import mongoose from "mongoose";

const filmmakerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    bio: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ""
    },
    specialization: {
        type: String,
        enum: ['Director', 'Producer', 'Cinematographer', 'Editor', 'Writer'],
        required: true
    },
    experience: {
        type: Number,
        default: 0
    },
    portfolio: [{
        title: String,
        year: Number,
        role: String
    }],
    contact: {
        email: String,
        phone: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Filmmaker = mongoose.model("Filmmaker", filmmakerSchema);
export default Filmmaker;