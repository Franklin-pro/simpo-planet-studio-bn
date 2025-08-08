import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const musicSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
    index: true
  },
  artist: { 
    type: String, 
    required: [true, 'Artist is required'],
    trim: true,
    maxlength: [100, 'Artist name cannot exceed 100 characters'],
    index: true
  },
  album: {
    type: String,
    trim: true,
    maxlength: [100, 'Album name cannot exceed 100 characters'],
    default: "Single"
  },
  genre: {
    type: String,
    trim: true,
    maxlength: [50, 'Genre cannot exceed 50 characters'],
    default: "Hip Hop",
    index: true
  },
  releaseDate: {
    type: Date,
    default: Date.now,
    validate: {
      validator: function(v) {
        return v <= new Date();
      },
      message: 'Release date cannot be in the future'
    }
  },
  duration: {
    type: Number, // in seconds
  },
  coverImageUrl: {
    type: String,
    required: [true, 'Cover image URL is required'],
    validate: {
      validator: function(v) {
        return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
  youtubeLink: {
    type: String,
    validate: {
      validator: function(v) {
        if (!v) return true; // optional field
        return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/.test(v);
      },
      message: props => `${props.value} is not a valid YouTube URL!`
    }
  },
  
  audioUrl: {
    type: String,
    required: [true, 'Audio URL is required'],
    validate: {
      validator: function(v) {
        return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
  playCount: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  lastPlayed: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  tags: {
    type: [String],
    default: []
  }
}, { 
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v;
      delete ret.isActive;
      return ret;
    }
  },
  toObject: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v;
      delete ret.isActive;
      return ret;
    }
  }
});

// Add text index for search
musicSchema.index({
  title: 'text',
  artist: 'text',
  album: 'text',
  genre: 'text',
  tags: 'text'
});

// Virtual for formatted duration (mm:ss)
musicSchema.virtual('durationFormatted').get(function() {
  const mins = Math.floor(this.duration / 60);
  const secs = Math.floor(this.duration % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
});

// Virtual for popularity score (based on play count and recency)
musicSchema.virtual('popularityScore').get(function() {
  const ageInDays = (new Date() - this.releaseDate) / (1000 * 60 * 60 * 24);
  const recencyFactor = Math.max(0, 30 - ageInDays) / 30; // Fades over 30 days
  return this.playCount * (0.7 + 0.3 * recencyFactor);
});

// Pre-save hook to normalize data
musicSchema.pre('save', function(next) {
  // Trim all string fields
  this.title = this.title.trim();
  this.artist = this.artist.trim();
  if (this.album) this.album = this.album.trim();
  if (this.genre) this.genre = this.genre.trim();
  
  // Ensure tags are lowercase and unique
  if (this.tags && this.tags.length) {
    this.tags = [...new Set(this.tags.map(tag => tag.toLowerCase().trim()))];
  }
  
  next();
});

// Static method for getting top songs
musicSchema.statics.getTopSongs = async function(limit = 10) {
  return this.find({ isActive: true })
    .sort({ playCount: -1, lastPlayed: -1 })
    .limit(limit)
    .lean();
};

// Static method for getting recently added songs
musicSchema.statics.getRecentSongs = async function(limit = 10) {
  return this.find({ isActive: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

// Instance method for incrementing play count
musicSchema.methods.incrementPlayCount = async function() {
  this.playCount += 1;
  this.lastPlayed = new Date();
  return this.save();
};

// Add pagination plugin
musicSchema.plugin(mongoosePaginate);

const Music = mongoose.model("Music", musicSchema);
export default Music;