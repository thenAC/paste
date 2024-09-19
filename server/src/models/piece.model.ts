import mongoose from 'mongoose';

export const pieceSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    author: {
      type: Number,
      required: true,
    },
    bytes: {
      type: Number,
      required: true,
    },
    lang: {
      type: String,
      required: true,
    },
    ttl: {
      type: Number,
      required: true,
    },
    rel: {
      type: String,
    },
    expireAt: {
      type: Date,
    },
    ip: {
      type: String,
      required: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    minimize: false,
  },
);

pieceSchema.index({ key: 'text' }, { unique: true });
pieceSchema.index({ author: 1 });
pieceSchema.index({ lang: 'text' });
pieceSchema.index({ expireAt: 1 });

export const Piece = mongoose.model('Piece', pieceSchema);
