import { Schema } from 'mongoose';
import increment from 'mongoose-auto-increment';
import mongoose from '../database';

const documentSchema = new Schema(
  {
    id: { type: Schema.Types.Number },
    data: { type: Schema.Types.String },
    name: { type: Schema.Types.String },
    author: { type: Schema.Types.ObjectID },
    hash: { type: Schema.Types.String },
    link: { type: Schema.Types.String },
    txid: { type: Schema.Types.String },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);
documentSchema.plugin(increment.plugin, 'document');
const Document = mongoose.model('document', documentSchema);

export default Document;
