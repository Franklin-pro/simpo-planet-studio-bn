// server.test.js
import { jest } from '@jest/globals';
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

// Mock controllers
jest.unstable_mockModule('./controllers/gallery.controller.js', () => ({
  getGalleryItems: jest.fn((req, res) => res.status(200).json([])),
  createGalleryItem: jest.fn((req, res) => res.status(201).json({ success: true })),
  getGalleryItemById: jest.fn((req, res) => res.status(200).json({})),
  updateGalleryItem: jest.fn((req, res) => res.status(200).json({})),
  deleteGalleryItem: jest.fn((req, res) => res.status(200).json({})),
  likeGalleryItem: jest.fn((req, res) => res.status(200).json({}))
}));

jest.unstable_mockModule('./controllers/artist.controller.js', () => ({
  default: jest.fn((req, res) => res.status(200).json([]))
}));

jest.unstable_mockModule('./controllers/music.controller.js', () => ({
  default: jest.fn((req, res) => res.status(200).json([]))
}));

jest.unstable_mockModule('./controllers/producers.controller.js', () => ({
  default: jest.fn((req, res) => res.status(200).json([]))
}));

jest.unstable_mockModule('./controllers/contact.controller.js', () => ({
  default: jest.fn((req, res) => res.status(200).json([]))
}));

jest.unstable_mockModule('./controllers/admin.cotroller.js', () => ({
  default: jest.fn((req, res) => res.status(400).json({ error: 'Invalid credentials' }))
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
  // describe('Gallery Routes', () => {
  //   it('should handle gallery endpoint', async () => {
  //     const res = await request(app).get('/api/v1/gallery');
  //     expect(res.status).toBe(200);
  //   });
  // });

  // describe('Artist Routes', () => {
  //   it('should handle artist endpoint', async () => {
  //     const res = await request(app).get('/api/v1/artist');
  //     expect([200, 404]).toContain(res.status);
  //   });
  // });

  describe('Admin Routes', () => {
    it('should handle login endpoint', async () => {
      const res = await request(app).post('/api/v1/admin/login');
      expect([400, 401, 422, 500]).toContain(res.status);
    });
  });

  // describe('Contact Routes', () => {
  //   it('should handle contact endpoint', async () => {
  //     const res = await request(app).get('/api/v1/contact');
  //     expect([200, 404]).toContain(res.status);
  //   });
  // });

  // describe('Music Routes', () => {
  //   it('should handle music endpoint', async () => {
  //     const res = await request(app).get('/api/v1/music');
  //     expect([200, 404]).toContain(res.status);
  //   });
  // });

  // describe('Producer Routes', () => {
  //   it('should handle producer endpoint', async () => {
  //     const res = await request(app).get('/api/v1/producer');
  //     expect([200, 404]).toContain(res.status);
  //   });
  // });
});
