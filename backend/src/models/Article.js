import { Schema, model } from 'mongoose';

const articleSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    article: {
      type: String,
      required: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    imagePublicId: {
      type: String,
      default: null,
      select: false,
    },

    publicationDate: {
      type: Date,
      required: true,
      index: true,
    },

    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    viewsCount: {
      type: Number,
      default: 0,
      min: 0,
      index: true,
    },

    category: {
      type: String,
      enum: ['popular', 'general'],
      default: 'general',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

articleSchema.index({
  authorId: 1,
  publicationDate: -1,
});

articleSchema.index({
  viewsCount: -1,
  publicationDate: -1,
});

export const Article = model('Article', articleSchema);
