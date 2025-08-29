// server.test.js
import { describe, jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// -------------------------------
// Mock mongoose and models BEFORE importing routes
// -------------------------------
jest.unstable_mockModule('mongoose', () => ({
  connect: jest.fn().mockResolvedValue(),
  connection: { close: jest.fn() },
  Schema: jest.fn(),
  model: jest.fn(),
}));

// Mock models and utilities
jest.unstable_mockModule('./models/gallery.model.js', () => ({
  default: {
    find: jest.fn().mockResolvedValue([]),
    findById: jest.fn().mockResolvedValue(null),
    findByIdAndUpdate: jest.fn().mockResolvedValue(null),
    findByIdAndDelete: jest.fn().mockResolvedValue(null),
    prototype: {
      save: jest.fn().mockResolvedValue({})
    }
  }
}));

jest.unstable_mockModule('./utils/cloudinary.js', () => ({
  cloudinaryUpload: jest.fn().mockResolvedValue({ secure_url: 'test-url' })
}));



// -------------------------------
// Import routes AFTER mocking mongoose
// -------------------------------
import galleryRoutes from './routes/gallery.route.js';
import artistRoutes from './routes/artist.routes.js';
import loginRoutes from './routes/login.routes.js';
import contactRoutes from './routes/contact.route.js';
import musicRoutes from './routes/music.route.js';
import producerRoutes from './routes/producer.routes.js';
import filmmakerRoutes from './routes/filmmaker.routes.js';

describe('API Server', () => {
  let app;

  // Set up Express app before each test
  beforeEach(() => {
    dotenv.config();
    app = express();

    app.use(express.json({ limit: '10mb' }));
    app.use(cookieParser());
    app.use(cors());
    app.use(express.urlencoded({ extended: true }));

    // Health check route
    app.get('/health', (req, res) => {
      res.status(200).json({ status: 'OK' });
    });

    // Mount routes
    app.use('/api/v1/gallery', galleryRoutes);
    app.use('/api/v1/artist', artistRoutes);
    app.use('/api/v1/admin', loginRoutes);
    app.use('/api/v1/contact', contactRoutes);
    app.use('/api/v1/music', musicRoutes);
    app.use('/api/v1/producer', producerRoutes);
    app.use('/api/v1/filmmaker', filmmakerRoutes);
  });

  // Clean up after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  // -------------------------------
  // Health check test
  // -------------------------------
  describe('GET /health', () => {
    it('should return 200 and status OK', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: 'OK' });
    });
  });

  // -------------------------------
  // Example template for other routes
  // -------------------------------
  
  describe('Admin Routes', () => {
    it('should handle login endpoint', async () => {
      const res = await request(app).post('/api/v1/admin/login');
      expect([400, 401, 422, 500]).toContain(res.status);
    });
  });

  describe('Gallery Routes', () => {
    it('should mount gallery routes', () => {
      expect(galleryRoutes).toBeDefined();
    });
  });

  describe('Artist Routes', () => {
    it('should mount artist routes', () => {
      expect(artistRoutes).toBeDefined();
    });
  });

  describe('Contact Routes', () => {
    it('should mount contact routes', () => {
      expect(contactRoutes).toBeDefined();
    });
  });

  describe('Music Routes', () => {
    it('should mount music routes', () => {
      expect(musicRoutes).toBeDefined();
    });
  });

  describe('Producer Routes', () => {
    it('should mount producer routes', () => {
      expect(producerRoutes).toBeDefined();
    });
  });
});

describe('filmmakerRoutes',()=>{
  it('should mount filmmaker routes', () => {
    expect(filmmakerRoutes).toBeDefined();
  });
}
)
