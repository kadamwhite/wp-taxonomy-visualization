import React from 'react';

import ForceGraphContainer from '../containers/ForceGraphContainer';
import SelectedContainer from '../containers/SelectedContainer';

import styles from './App.styl';

const App = () => (
  <div className={styles.App}>
    <ForceGraphContainer />
    <SelectedContainer />
  </div>
);

export default App;
