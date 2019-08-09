import express from 'express';
import http from 'http';
import router from './routes';
import mongoose from './database';

const app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.json());
app.use('/', router);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('connected');
});

const server = http.createServer(app);
server.listen(app.get('port'), () => {
  console.log(`Express server listening on port ${app.get('host') + app.get('port')}`);
});
