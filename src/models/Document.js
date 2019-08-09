import { Schema } from 'mongoose';
import mongoose from '../database';

const documentSchema = new Schema(
  {
    name: { type: Schema.Types.String },
    author: { type: Schema.Types.ObjectID },
    hash: { type: Schema.Types.String },
    link: { type: Schema.Types.String },
    txid: { type: Schema.Types.String },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

const Document = mongoose.model('document', documentSchema);

export default Document;
