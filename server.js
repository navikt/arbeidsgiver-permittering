'use strict';
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const fs = require('fs-extra');
const request = require('request');
const jsdom = require('jsdom');
const NodeCache = require('node-cache');
const VAULT_PATH = '/var/run/secrets/nais.io/vault/enviroment.env';
const sanityClient = require('@sanity/client');

require('console-stamp')(console, '[HH:MM:ss.l]');
require('dotenv').config({
    path: process.env.NODE_ENV === 'production' ? VAULT_PATH : '.env',
});

const server = express();
server.use(helmet());

const client = sanityClient({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_DATASET,
    token: process.env.SANITY_TOKEN,
    useCdn: false,
});

const BASE_URL = '/arbeidsgiver-permittering';
const { JSDOM } = jsdom;
const prop = 'innerHTML';
const url =
    process.env.DECORATOR_EXTERNAL_URL ||
    'https://appres.nav.no/common-html/v4/navno?header-withmenu=true&styles=true&scripts=true&footer-withmenu=true';

const htmlinsert = [
    { inject: 'styles', from: 'styles' },
    { inject: 'scripts', from: 'scripts' },
    { inject: 'headerWithmenu', from: 'header-withmenu' },
    { inject: 'footerWithmenu', from: 'footer-withmenu' },
    { inject: 'megamenuResources', from: 'megamenu-resources' },
];

// Cache init
const mainCacheKey = 'tiltak-withMenu';
const backupCacheKey = 'tiltak-withMenuBackup';
const mainCache = new NodeCache({ stdTTL: 10000, checkperiod: 10020 });
const backupCache = new NodeCache({ stdTTL: 0, checkperiod: 0 });

server.get('/arbeidsgiver-permittering/internal/isAlive', (req, res) =>
    res.sendStatus(200)
);
server.get('/arbeidsgiver-permittering/internal/isReady', (req, res) =>
    res.sendStatus(200)
);

const setBuildpathStatic = (subpath) => {
    return express.static(path.join(__dirname, `build/${subpath}`));
};

const serverUse = (staticPath) => {
    return server.use(
        `${BASE_URL}/${staticPath}`,
        setBuildpathStatic(staticPath)
    );
};

server.get(`${BASE_URL}/innhold`, (req, res) => {
    const query =
        "*[_type == 'hvordan-permittere-ansatte' || _type == 'i-permitteringsperioden' || _type == 'nar-skal-jeg-utbetale-lonn' || _type == 'vanlige-sporsmal']";
    client.fetch(query).then((result) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader(
            'Access-Control-Allow-Methods',
            'GET, POST, OPTIONS, PUT, PATCH, DELETE'
        ); // If needed
        res.setHeader(
            'Access-Control-Allow-Headers',
            'X-Requested-With,content-type'
        ); // If needed
        res.setHeader('Access-Control-Allow-Credentials', true); // If needed
        res.send(result);
    });
});

const injectMenuIntoHtml = (menu) => {
    fs.readFile(__dirname + '/build/index.html', 'utf8', function (err, html) {
        if (!err) {
            const { document } = new JSDOM(html).window;
            htmlinsert.forEach((element) => {
                document.getElementById(element.inject)[
                    prop
                ] = menu.getElementById(element.from)[prop];
            });
            const output = document.documentElement.innerHTML;
            mainCache.set(mainCacheKey, output, 10000);
            backupCache.set(backupCacheKey, output, 0);
            serveAppWithMenu(output);
        } else {
            checkBackupCache();
        }
    });
};

const getMenu = () => {
    request({ method: 'GET', uri: url }, (error, response, body) => {
        if (!error && response.statusCode >= 200 && response.statusCode < 400) {
            const { document } = new JSDOM(body).window;
            injectMenuIntoHtml(document);
        } else {
            console.log('tried to fetch menu fragments from ', `${url}`);
            console.log('respons failed, with response ', response);
            console.log('error: ', error);
            checkBackupCache();
        }
    });
};

const serveAppWithMenu = (app) => {
    const staticPaths = [
        'asset-manifest.json',
        'manifest.json',
        'favicon.ico',
        'precache-manifest.*',
        'service-worker.js',
        'permittering.nav.illustrasjon.png',
        'static',
        'index.css',
    ];

    staticPaths.map((path) => serverUse(path));
    server.get([`${BASE_URL}/`, `${BASE_URL}/*`], (req, res) => {
        res.send(app);
    });
    setServerPort();
};

const setServerPort = () => {
    const port = process.env.PORT || 3000;
    server.listen(port, () => {
        console.log('server listening on port', port);
    });
};

const serveAppWithOutMenu = () => {
    server.use(BASE_URL, express.static(path.join(__dirname, 'build')));
    server.get(`${BASE_URL}/*`, (req, res) => {
        res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
    });
    setServerPort();
};

const getMenuAndServeApp = () => {
    mainCache.get(mainCacheKey, (err, response) => {
        if (!err && response !== undefined) {
            serveAppWithMenu(response);
        } else {
            getMenu();
        }
    });
};

const checkBackupCache = () => {
    backupCache.get(backupCacheKey, (err, response) => {
        if (!err && response !== undefined) {
            mainCache.set(mainCacheKey, response, 10000);
            serveAppWithMenu(response);
        } else {
            console.log('failed to fetch menu');
            console.log(
                'cache store empty, serving app with out menu fragments'
            );
            serveAppWithOutMenu();
        }
    });
};

getMenuAndServeApp();
