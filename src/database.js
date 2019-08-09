import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/watchdocs', { useNewUrlParser: true });

export default mongoose;
