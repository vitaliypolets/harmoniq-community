import mongoose from 'mongoose';
import { env } from '../config/env.js';

export async function connectMongoDB() {
  await mongoose.connect(env.mongoUrl);
  console.log('MongoDB connected');
}

export async function disconnectMongoDB() {
  await mongoose.disconnect();
}
