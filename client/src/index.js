import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import DataProvider from './redux/store'

ReactDOM.render(
    <DataProvider>
      <App />
    </DataProvider>,
  document.getElementById('root')
);

serviceWorker.unregister();
