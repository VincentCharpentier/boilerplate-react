import React from 'react';
import {Switch, Route} from 'react-router';

import Button from '~/components/Buttons/Button.view';

class HomeTest extends React.Component {
  render() {
    return (
      <div>
        <h1>Site 2</h1>
        <Button label={"test button"}/>
      </div>
    );
  }
}

export default () => (
  <Switch>
    <Route exact path="/site2" component={HomeTest}/>
  </Switch>
);
