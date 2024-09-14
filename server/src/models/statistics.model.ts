import mongoose from 'mongoose';

export const statisticsSchema = new mongoose.Schema(
  {
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

export const Statistics = mongoose.model('Statistics', statisticsSchema);
