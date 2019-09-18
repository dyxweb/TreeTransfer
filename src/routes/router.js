import React from "react";
import {BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import treeTransferExer from './treeTransferExer'

class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" component={treeTransferExer} />               
        </Switch>
      </Router>
    )  
  }
}

export default App;