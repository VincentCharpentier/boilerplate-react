import React from 'react';
import Loadable from 'react-loadable';
import { Switch, Route } from 'react-router';

const Site1 = Loadable({
  loader: () => import(/* webpackChunkName = "site1" */ '../../sites/site1/Router'),
  loading() {
    return <p>Loading Site 1</p>;
  },
});

const Site2 = Loadable({
  loader: () =>
    import(/* webpackChunkName = "site2" */ '../../sites/site2/Router'),
  loading() {
    return <p>Loading Site 2</p>;
  },
});

export default class MainRouter extends React.Component {
  render() {
    return (
      <Switch>
        <Route path={'/site1'} component={Site1} />
        <Route path={'/site2'} component={Site2} />
      </Switch>
    );
  }
}
