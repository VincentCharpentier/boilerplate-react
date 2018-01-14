import React from 'react';
import {Switch, Route} from 'react-router';

import Button from '~/components/Buttons/Button.view';

class HomeTest extends React.Component {
  render() {
    return (
      <div>
        <h1>Site 1</h1>
        <Button label={"test button"}/>
      </div>
    );
  }
}

export default () => (
  <Switch>
    <Route exact path="/site1" component={HomeTest}/>
  </Switch>
);
