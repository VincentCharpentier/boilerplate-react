import fs from 'fs';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import Loadable from 'react-loadable';
import { getBundles } from 'react-loadable/webpack';

import config from '../config';
import MainRouter from '~/router/MainRouter';
import SSR from './ssrUtils';

const rootDir = path.resolve(__dirname, '..');
const dev = process.env.NODE_ENV !== 'production';

// CONFIG SERVER
const app = express();

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  }),
);

// Use gzipped assets for JS, CSS & HTML
app.get('*.(js|css|html)', function(req, res, next) {
  let gzipPath = path.join(config.buildDirectory, req.url + '.gz');
  // Check that zipped asset exists
  if (fs.existsSync(gzipPath)) {
    const ext = req.url.match(/[^.]+$/)[0];
    switch (ext) {
      case 'css':
        res.set('Content-Type', 'text/css');
        break;
      case 'js':
        res.set('Content-Type', 'application/js');
        break;
    }
    req.url = req.url + '.gz';
    res.set('Content-Encoding', 'gzip');
  }
  next();
});

// CONFIG ROUTES
app.use('/static', express.static(rootDir + '/static'));
app.use(express.static(rootDir + '/dist'));

app.use(function(req, res, next) {
  const context = {}; // required
  const modules = [];
  const stats = require('../dist/react-loadable.json');

  const initialView = renderToString(
    <Loadable.Capture report={(moduleName) => modules.push(moduleName)}>
      <StaticRouter location={req.url} context={context}>
        <MainRouter />
      </StaticRouter>
    </Loadable.Capture>,
  );

  const bundles = getBundles(stats, modules)
    .map((b) => b.file)
    .filter((file) => !file.endsWith('.map'));

  res.status(context.status || 200).end(
    SSR.renderFullPage({
      html: initialView,
      jsBundles: ['main.bundle.js'].concat(bundles),
      cssBundles: ['main.min.css'],
    }),
  );
});

app.use(function(err, req, res, next) {
  res.status(500).end(SSR.renderError(err));
});

Loadable.preloadAll().then(() => {
  // LAUNCH SERVER
  /* eslint-disable no-console */
  app.listen(3032, (err) => {
    if (err) throw err;
    console.log('Server ready on http://localhost:3032');
  });
});
