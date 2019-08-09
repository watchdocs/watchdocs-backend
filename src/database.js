import mongoose from 'mongoose';

mongoose.connect('mongodb://mongo:27017/cielmusic', { useNewUrlParser: true });

export default mongoose;
