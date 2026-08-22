import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 32,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      maxlength: 64,
      lowercase: true,
      trim: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    avatarUrl: {
      type: String,
      default: null,
    },
    avatarPublicId: {
      type: String,
      default: null,
      select: false,
    },
    savedArticles: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
    articlesAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true, versionKey: false },
);

export const User = model('User', userSchema);
