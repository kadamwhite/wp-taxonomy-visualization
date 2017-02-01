import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { anyNode, taxonomyNode } from '../prop-types';

import Selected from '../components/Selected';

const SelectedContainer = ({node, categories, tags}) => {
  if (!node) {
    return null;
  }
  const filteredCats = node.categories ?
    node.categories.map(catId => categories.find(cat => cat.id === catId.toString())) :
    [];
  const filteredTags = node.tags ?
    node.tags.map(tagId => tags.find(tag => tag.id === tagId.toString())) :
    [];
  return (
    <Selected
      node={node}
      categories={filteredCats}
      tags={filteredTags}
    />
  );
}

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
  categories: state.categories,
  tags: state.tags,
  //  && Array.isArray(state.selected.categories) ?
  //   state.selected.categories.map(catId => state.categories.find(cat => cat.id === catId)) :
  //   [],
  // tags: state.selected && Array.isArray(state.selected.tags) ?
  //   state.selected.tags.map(tagId => state.tags.find(tag => tag.id === tagId)) :
  //   [],
});

export default connect(mapStateToProps)(SelectedContainer);
