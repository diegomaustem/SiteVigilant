import express from 'express';
import router from './routes/index.js';
import { errorHandler } from './middlewares/error-handler.js';
import { startMonitorJobs } from './jobs/monitor.job.js';

const app: express.Application = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

startMonitorJobs();

app.use(errorHandler);

export default app;