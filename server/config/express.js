import path from 'path';
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import router from '../routes/routes.js';

export default function () {
    // Initialize app
    const app = express();

    // enable request logging for development debugging
    app.use(morgan('dev'));

    // Allow CORS requests (this is necessary because the frontend sends a fetch to the entire URL, which no longer uses a proxy)
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "http://localhost:3000");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    // body parsing middleware
    app.use(bodyParser.json());

    // add a router
    app.use('/api/', router);

    if (process.env.NODE_ENV === 'production') {
        // Serve any static files
        app.use(express.static(path.join(__dirname, '../../client/build')));

        // Handle React routing, return all requests to React app
        app.get('*', function (req, res) {
            res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
        });
    }

    return app;
}
