import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import galleryRoutes from './routes/gallery.route.js';


const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.DATABASE_URL;
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/gallery', galleryRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

mongoose.connect(MONGO_URI).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});