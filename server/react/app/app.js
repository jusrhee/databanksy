import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Main from './Main';

ReactDOM.render (
    <BrowserRouter>
      <Switch>
        <Route path="/app/saved" render={(props) => <Main currentScreen='Saved'/>}/>
        <Route path="/app/search" render={(props) => <Main currentScreen='Search'/>}/>
        <Route path="/app" render={(props) => <Main currentScreen='Home'/>}/>
      </Switch>
    </BrowserRouter>,
  document.getElementById('root')
);