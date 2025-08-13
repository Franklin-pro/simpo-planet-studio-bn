import mongoose from 'mongoose';

const creditSchema = new mongoose.Schema({
  project: {
    type: String,
    trim: true,
    default: ''
  },
  role: {
    type: String,
    trim: true,
    default: ''
  },
  year: {
    type: Number,
    min: 1900,
    max: new Date().getFullYear(),
    default: new Date().getFullYear()
  }
});

const socialMediaSchema = new mongoose.Schema({
  instagram: { type: String, trim: true, default: '' },
  twitter: { type: String, trim: true, default: '' },
  facebook: { type: String, trim: true, default: '' },
  spotify: { type: String, trim: true, default: '' },
  soundCloud: { type: String, trim: true, default: '' },
  youtube: { type: String, trim: true, default: '' },
  appleMusic: { type: String, trim: true, default: '' }
});

const producerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Producer name is required'],
    trim: true
  },
  level: {
    type: String,
    enum: ['Junior', 'Mid-level', 'Senior', 'Legendary'],
    default: 'Junior'
  },
  image: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    required: [true, 'Bio is required'],
    minlength: [50, 'Bio must be at least 50 characters'],
    maxlength: [500, 'Bio cannot be longer than 500 characters'],
    trim: true
  },
  genres: {
    type: [String],
    default: [],
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'At least one genre is required'
    }
  },
  skills: {
    type: [String],
    default: [],
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'At least one skill is required'
    }
  },
  contactEmail: {
    type: String,
    required: [true, 'Contact email is required'],
    match: [/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'Invalid email format'],
    trim: true
  },
  yearsExperience: {
    type: Number,
    required: [true, 'Years of experience is required'],
    min: [0, 'Years of experience cannot be negative'],
    max: [50, 'Years of experience cannot exceed 50']
  },
  credits: {
    type: [creditSchema],
    default: []
  },
  socialMedia: {
    type: socialMediaSchema,
    default: {}
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

producerSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

producerSchema.statics.findByLevel = function(level) {
  return this.find({ level: new RegExp(level, 'i') });
};

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