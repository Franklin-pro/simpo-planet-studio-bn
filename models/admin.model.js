import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  rememberMe: {
    type: Boolean,
    default: false,
  },
  userType: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
});
const Admin = mongoose.model("Admin", adminSchema);
export default Admin;