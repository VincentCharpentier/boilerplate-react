import '@babel/polyfill';
import React from 'react';
import Loadable from 'react-loadable';
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import MainRouter from '~/router/MainRouter';

window.main = () => {
  Loadable.preloadReady().then(() => {
    hydrate(
      <BrowserRouter>
        <MainRouter />
      </BrowserRouter>,
      document.getElementById('app_root'),
    );
  });
};
