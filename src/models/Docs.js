import { Schema } from 'mongoose';
import mongoose from '../database';

const docsSchema = new Schema(
  {
    name: { type: Schema.Types.String },
    hash: { type: Schema.Types.String },
    txid: { type: Schema.Types.String },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

const Docs = mongoose.model('docs', docsSchema);

export default Docs;
