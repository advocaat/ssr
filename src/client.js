import React from 'react';
import ReactDom from 'react-dom';
import App from './app';



ReactDOM.hydrate(<App gists={window.gists} />, document.getElementById('app'));