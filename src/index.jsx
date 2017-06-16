import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { AppContainer } from 'react-hot-loader';
// AppContainer is a necessary wrapper component for HMR

import './global.styl';

import App from './components/App';

import makeStore from './store';

// import { getAllContent } from './services/api';
// getAllContent(function onPostBatch(slug, batch) {
//   console.log('Received a batch of ' + slug);
//   console.log(batch);
// }, function onTermBatch(termSlug, batch) {
//   console.log('Received a batch of ' + termSlug);
//   console.log(batch);
// })
//   .then(r => console.log(r))
//   .catch(e => console.log(e));

const store = makeStore();
window.store = store;

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <Component />
      </Provider>
    </AppContainer>,
    document.getElementById('root')
  );
};

render(App);

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./components/App', () => {
    render(App);
  });
}
