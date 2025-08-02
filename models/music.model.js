import mongoose from "mongoose";

const musicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true }, // Simple string instead of ObjectId
  album: String,
  genre: String,
  releaseDate: Date,
  duration: Number,
  coverImageUrl: String,
  youtubeLink: String
}, { timestamps: true });
const Music = mongoose.model("Music", musicSchema);
export default Music;