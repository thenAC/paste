import mongoose from 'mongoose';

export const statisticsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    totalCount: {
      type: BigInt,
      required: true,
      default: 0n,
    },
    totalBytes: {
      type: BigInt,
      required: true,
      default: 0n,
    },
  },
  {
    minimize: false,
  },
);

statisticsSchema.index({ key: 'text' }, { unique: true });

export const Statistics = mongoose.model('Statistics', statisticsSchema);
