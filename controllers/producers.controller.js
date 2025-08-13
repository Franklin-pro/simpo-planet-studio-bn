import Producer from "../models/producers.model.js";
import { cloudinaryUpload } from "../utils/cloudinary.js";
import fs from 'fs';

const createProducer = async (req, res) => {
  try {
    // Parse body fields
    const {
      name,
      level,
      bio,
      contactEmail,
      yearsExperience
    } = req.body;

    // Parse JSON strings
    let genres = [];
    let skills = [];
    let credits = [];
    let socialMedia = {};

    try {
      if (req.body.genres) genres = JSON.parse(req.body.genres);
      if (req.body.skills) skills = JSON.parse(req.body.skills);
      if (req.body.credits) credits = JSON.parse(req.body.credits);
      if (req.body.socialMedia) socialMedia = JSON.parse(req.body.socialMedia);
    } catch (parseError) {
      return res.status(400).json({ success: false, message: "Invalid JSON format in array/object fields", error: parseError.message });
    }

    let imageUrl = '';
    if (req.file) {
      const cloudinaryResult = await cloudinaryUpload(req.file.path, "producers");
      imageUrl = cloudinaryResult?.secure_url || '';
      // Clean up temp file
      fs.unlinkSync(req.file.path);
    }

    const producer = new Producer({
      name,
      level,
      image: imageUrl,
      bio,
      genres,
      skills,
      contactEmail,
      yearsExperience: parseInt(yearsExperience, 10),
      credits,
      socialMedia
    });

    await producer.save();

    res.status(201).json({
      success: true,
      message: "Producer created successfully",
      data: producer
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating producer", error: error.message });
  }
};

const getProducers = async (req, res) => {
  try {
    const producers = await Producer.find();
    res.status(200).json({
      success: true,
      message: "Producers retrieved successfully",
      data: producers
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error retrieving producers", error: error.message });
  }
};

const getProducerById = async (req, res) => {
  try {
    const producer = await Producer.findById(req.params.id);
    if (!producer) {
      return res.status(404).json({ success: false, message: "Producer not found" });
    }
    res.status(200).json({
      success: true,
      message: "Producer retrieved successfully",
      data: producer
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error retrieving producer", error: error.message });
  }
};

const updateProducer = async (req, res) => {
  try {
    // Parse body fields similarly
    const {
      name,
      level,
      bio,
      contactEmail,
      yearsExperience
    } = req.body;

    let genres = [];
    let skills = [];
    let credits = [];
    let socialMedia = {};

    try {
      if (req.body.genres) genres = JSON.parse(req.body.genres);
      if (req.body.skills) skills = JSON.parse(req.body.skills);
      if (req.body.credits) credits = JSON.parse(req.body.credits);
      if (req.body.socialMedia) socialMedia = JSON.parse(req.body.socialMedia);
    } catch (parseError) {
      return res.status(400).json({ success: false, message: "Invalid JSON format in array/object fields", error: parseError.message });
    }

    let imageUrl;
    if (req.file) {
      const cloudinaryResult = await cloudinaryUpload(req.file.path, "producers");
      imageUrl = cloudinaryResult?.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const updateData = {
      name,
      level,
      bio,
      genres,
      skills,
      contactEmail,
      yearsExperience: parseInt(yearsExperience, 10),
      credits,
      socialMedia
    };

    if (imageUrl) updateData.image = imageUrl;

    const producer = await Producer.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!producer) {
      return res.status(404).json({ success: false, message: "Producer not found" });
    }

    res.status(200).json({
      success: true,
      message: "Producer updated successfully",
      data: producer
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating producer", error: error.message });
  }
};

const deleteProducer = async (req, res) => {
  try {
    const producer = await Producer.findByIdAndDelete(req.params.id);
    if (!producer) {
      return res.status(404).json({ success: false, message: "Producer not found" });
    }
    res.status(200).json({ success: true, message: "Producer deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting producer", error: error.message });
  }
};

export {
  createProducer,
  getProducers,
  getProducerById,
  updateProducer,
  deleteProducer
};