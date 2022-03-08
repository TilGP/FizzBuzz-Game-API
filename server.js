import express from 'express';
import { router } from './routes/api.js';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', router);

app.listen(process.argv[2] || 3500, () => console.log(`listening at port ${process.argv[2] || 3500}`));