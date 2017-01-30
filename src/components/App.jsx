import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';

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

import ForceGraph from './ForceGraph';

class App extends PureComponent {

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

App.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  posts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    categories: PropTypes.arrayOf(PropTypes.number),
    tags: PropTypes.arrayOf(PropTypes.number),
  })).isRequired,
  categories: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    count: PropTypes.number,
  })).isRequired,
  tags: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    count: PropTypes.number,
  })).isRequired,
};

const mapStateToProps = state => ({
  posts: state.posts,
  tags: state.tags,
  categories: state.categories,
});

const mapDispatchToProps = dispatch => ({
  onSelectNode: (node) => dispatch(selectNode(node)),
  onDeselectNode: () => dispatch(deselectNode())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
