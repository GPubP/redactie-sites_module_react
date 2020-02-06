import React from 'react';
import logo from './logo.svg';
import './App.css';

import { app } from 'redactie-boilerplate-module';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
				<h1>{app.title}</h1>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
      </header>
    </div>
  );
}

export default App;
