import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';

import {
  addPosts,
  addTags,
  addCategories,
} from '../actions';

import {
  getAllPosts,
  getAllTags,
  getAllCategories,
} from '../services/api';

import ForceGraph from './ForceGraph';

class App extends PureComponent {

  componentDidMount() {
    const { dispatch } = this.props;

    getAllTags((tags) => {
      dispatch(addTags(tags));
    }).catch(e => console.error(e));

    getAllCategories((cats) => {
      dispatch(addCategories(cats));
    }).catch(e => console.error(e));

    getAllPosts((posts) => {
      dispatch(addPosts(posts));
    }).catch(e => console.error(e));

  }

  render() {
    const { posts, categories, tags } = this.props;
    return (
      <ForceGraph
        width={600}
        height={600}
        posts={posts}
        categories={categories}
        tags={tags}
      />
    );
  }
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
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

export default connect(mapStateToProps)(App);
