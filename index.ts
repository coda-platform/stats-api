// App config from .env
import * as dotenv from "dotenv";
dotenv.config();

import express from 'express';
import morgan from 'morgan';
import createError from 'http-errors';

import indexRoute from './src/routes/indexRoute';
import resourceRoute from './src/routes/resourceRoute';
import statsRoute from "./src/routes/statsRoute";
import version from "./src/utils/version";
import genericErrorResponseHandler from './src/utils/genericErrorReponseHandler';

// rest of the code remains same
const app = express();
const PORT = process.env.CODA_STATS_API_PORT;

// Better Logging
app.use(morgan('dev'));
//app.disable('etag');

// Middleware to process incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// All routes
app.use('/', indexRoute);
app.use('/resources', resourceRoute);
app.use('/stats', statsRoute);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

app.use(genericErrorResponseHandler.errorHandler);


// Custom error handler are removed. A lot less dependency and everything is logged in dev mode anyway.

// Running the server
app.listen(PORT, () => {
  console.log(`⚡️[coda-stats-api]: Server is running at http://localhost:${PORT}`);
  console.log(`⚡️[coda-stats-api]: Running ${version.getBuildVersion()} version of build`);
});