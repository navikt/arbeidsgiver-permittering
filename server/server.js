require('console-stamp')(console, '[HH:MM:ss.l]');

const express = require('express');
const template = require('./template');
const helmet = require('helmet');

const server = express();
const PORT = process.env.PORT || 3000;
const BASE_PATH = '/arbeidsgiver-permittering';
const NY_OMSTILLING_URL = process.env.NY_OMSTILLING_URL;

const addHeadersForCertainRequests = () =>
    server.use((req, res, next) => {
        if (template.corsWhitelist.includes(req.headers.origin)) {
            res.header('Access-Control-Allow-Origin', req.headers.origin);
            res.header(
                'Access-Control-Allow-Headers',
                'Origin, X-Requested-With, Content-Type, Accept'
            );
            res.header(
                'Access-Control-Allow-Methods',
                'GET, HEAD, OPTIONS, POST, PUT'
            );
            res.setHeader(
                'Access-Control-Allow-Headers',
                'X-Requested-With,content-type'
            );
            res.setHeader('Access-Control-Allow-Credentials', true);
        }

        next();
    });

const startServer = () => {
    server.use(
        helmet({
            contentSecurityPolicy: {
                directives: {
                    connectSrc: [
                        "'self'",
                        'https://*.nav.no',
                        'https://*.psplugin.com',
                        'https://*.hotjar.com',
                        'https://www.google-analytics.com',
                    ],
                    defaultSrc: ["'none'"],
                    fontSrc: [
                        "'self'",
                        'data:',
                        'https://*.psplugin.com',
                        'http://*.psplugin.com',
                    ],
                    frameSrc: [
                        'https://player.vimeo.com',
                        'https://*.hotjar.com',
                    ],
                    imgSrc: [
                        "'self'",
                        'data:',
                        'https://*.nav.no',
                        'https://www.google-analytics.com',
                    ],
                    manifestSrc: ["'self'"],
                    scriptSrc: [
                        "'self'",
                        'https://*.nav.no',
                        'https://www.googletagmanager.com',
                        'https://www.google-analytics.com',
                        'https://*.hotjar.com',
                        'https://account.psplugin.com',
                        "'unsafe-inline'",
                        "'unsafe-eval'",
                    ],
                    styleSrc: ["'self'", 'https://*.nav.no', "'unsafe-inline'"],
                },
                reportOnly: true,
            },
        })
    );

    addHeadersForCertainRequests();

    server.get(BASE_PATH, (req, res) => {
        console.log('utdatert permitteringsside besokt');
        res.redirect(NY_OMSTILLING_URL);
    });

    server.get(BASE_PATH + '/*', (req, res) => {
        console.log('utdatert permitteringsside besokt');
        res.redirect(NY_OMSTILLING_URL);
    });

    server.get(`${BASE_PATH}/internal/isAlive`, (req, res) =>
        res.sendStatus(200)
    );
    server.get(`${BASE_PATH}/internal/isReady`, (req, res) =>
        res.sendStatus(200)
    );

    server.listen(PORT, () => {
        console.log('Server listening on port', PORT);
    });
};

startServer();
