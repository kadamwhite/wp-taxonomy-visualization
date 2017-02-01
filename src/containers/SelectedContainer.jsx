import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { anyNode, taxonomyNode } from '../prop-types';

import Selected from '../components/Selected';

const SelectedContainer = props => (props.node ?
  <Selected
    node={props.node}
    categories={props.categories}
    tags={props.tags}
  /> :
  null
);

SelectedContainer.propTypes = {
  node: anyNode,
  categories: PropTypes.arrayOf(taxonomyNode).isRequired,
  tags: PropTypes.arrayOf(taxonomyNode).isRequired,
};

SelectedContainer.defaultProps = {
  node: null,
  categories: [],
  tags: [],
};

const mapStateToProps = state => ({
  node: state.selected,
  categories: state.selected && Array.isArray(state.selected.categories) ?
    state.selected.categories.map(catId => state.categories.find(cat => cat.id === catId)) :
    [],
  tags: state.selected && Array.isArray(state.selected.tags) ?
    state.selected.tags.map(tagId => state.tags.find(tag => tag.id === tagId)) :
    [],
});

export default connect(mapStateToProps)(SelectedContainer);
