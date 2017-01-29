import { createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import reducer from './reducers';

/**
 * Helper function to create store with provided reducer and initial state.
 *
 * @return {Object} An object that holds the complete state of the App.
 */
export default function makeStore() {
  const middleware = [
    createSagaMiddleware(),
  ];

  // This should be gated to only run in "dev", when and if that matters
  // middleware that logs actions
  middleware.push(createLogger({
    collapsed: true,
  }));

  const store = createStore(
    reducer,
    applyMiddleware(...middleware),
  );

  return store;
}
