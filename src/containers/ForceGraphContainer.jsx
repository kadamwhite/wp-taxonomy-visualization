import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';

import { postNode, taxonomyNode } from '../prop-types';

import {
//   addPosts,
//   addTags,
//   addCategories,
  selectNode,
  deselectNode,
} from '../actions';

// import {
//   getAllPosts,
//   getAllTags,
//   getAllCategories,
// } from '../services/api';

import ForceGraph from '../components/ForceGraph';

class ForceGraphContainer extends PureComponent {

  componentDidMount() {
  //   const { dispatch } = this.props;

  //   getAllTags((tags) => {
  //     dispatch(addTags(tags));
  //   }).catch(e => console.error(e));

  //   getAllCategories((cats) => {
  //     dispatch(addCategories(cats));
  //   }).catch(e => console.error(e));

  //   getAllPosts((posts) => {
  //     dispatch(addPosts(posts));
  //   }).catch(e => console.error(e));
  }

  render() {
    const {
      posts,
      categories,
      tags,
      onDeselectNode,
      onSelectNode,
    } = this.props;

    return (
      <ForceGraph
        width={1200}
        height={600}
        posts={posts}
        categories={categories}
        tags={tags}
        onMouseOver={onSelectNode}
        onMouseOut={onDeselectNode}
      />
    );
  }
}

ForceGraphContainer.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  posts: PropTypes.arrayOf(postNode).isRequired,
  categories: PropTypes.arrayOf(taxonomyNode).isRequired,
  tags: PropTypes.arrayOf(taxonomyNode).isRequired,
};

const mapStateToProps = state => ({
  posts: state.posts,
  tags: state.tags,
  categories: state.categories,
  selectedNodeId: state.selected ? state.selected.id : null,
});

const mapDispatchToProps = dispatch => ({
  onSelectNode: (node) => dispatch(selectNode(node)),
  onDeselectNode: () => dispatch(deselectNode())
});

export default connect(mapStateToProps, mapDispatchToProps)(ForceGraphContainer);
