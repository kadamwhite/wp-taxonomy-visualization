import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import ForceGraph from '../components/ForceGraph';

const ForceGraphContainer = ({node}) => {
  return (
    <ForceGraph
      node="node"
    />
  );
};

ForceGraphContainer.propTypes = {

};

export default ForceGraphContainer;
