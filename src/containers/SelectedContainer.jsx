import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { anyNode, taxonomyNode } from '../prop-types';

import Selected from '../components/Selected';

const SelectedContainer = ({ node, terms }) => {
  if (!node) {
    return null;
  }
  const categories = node.categories ?
    node.categories.map(catId => terms.find(term => term.id === catId.toString())) :
    [];
  const tags = node.tags ?
    node.tags.map(tagId => terms.find(term => term.id === tagId.toString())) :
    [];
  return (
    <Selected
      node={node}
      categories={categories}
      tags={tags}
    />
  );
};

SelectedContainer.propTypes = {
  node: anyNode,
  terms: PropTypes.arrayOf(taxonomyNode).isRequired,
};

SelectedContainer.defaultProps = {
  node: null,
};

const mapStateToProps = state => ({
  node: state.selected,
  terms: state.terms,
});

export default connect(mapStateToProps)(SelectedContainer);
