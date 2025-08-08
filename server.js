import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import galleryRoutes from './routes/gallery.route.js';
import artistRoutes from './routes/artist.routes.js';
import loginRoutes from './routes/login.routes.js';
import contactRoutes from './routes/contact.route.js';
import musicRoutes  from './routes/music.route.js';
import producerRoutes from './routes/producer.routes.js';
import cors from 'cors';

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.DATABASE_URL;
app.use(express.json({limit: '10mb'}));
app.use(cookieParser());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/gallery', galleryRoutes);
app.use('/api/v1/artist', artistRoutes);
app.use('/api/v1/admin', loginRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/music', musicRoutes);
app.use('/api/v1/producer', producerRoutes);



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

mongoose.connect(MONGO_URI).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});