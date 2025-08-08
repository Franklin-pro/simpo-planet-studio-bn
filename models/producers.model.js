import mongoose from 'mongoose';

const producerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Producer name is required'],
    trim: true
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Professional'],
    default: 'Beginner'
  },
  image: {
    type: String,
    required: [true, 'Image URL is required'],
    validate: {
      validator: function(v) {
        return /^(https?:\/\/).+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
      },
      message: props => `${props.value} is not a valid image URL!`
    }
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be longer than 500 characters'],
    default: ''
  },
  socialLinks: {
    type: Map,
    of: String,
    default: {}
  },
  genres: {
    type: [String],
    default: []
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add timestamp middleware
producerSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Static method example
producerSchema.statics.findByLevel = function(level) {
  return this.find({ level: new RegExp(level, 'i') });
};

// Instance method example
producerSchema.methods.getProfileSummary = function() {
  return {
    name: this.name,
    image: this.image,
    level: this.level,
    shortBio: this.bio.length > 100 ? this.bio.substring(0, 100) + '...' : this.bio
  };
};

const Producer = mongoose.model('Producer', producerSchema);

export default Producer;