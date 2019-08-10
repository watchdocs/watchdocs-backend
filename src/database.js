import mongoose from 'mongoose';
import increment from 'mongoose-auto-increment';

mongoose.connect('mongodb://mongo:27017/watchdocs', { useNewUrlParser: true });
increment.initialize(mongoose);

export default mongoose;
