import { combineReducers } from 'redux';
import * as actionTypes from '../actions';

export function postsReducer(state = [], action) {
  if (action.type === actionTypes.SET_POSTS) {
    return action.payload;
  }

  if (action.type === actionTypes.ADD_POSTS) {
    // Limit to only certain keys
    return state.concat(action.payload.map(post => ({
      title: post.title.rendered,
      id: post.id,
      categories: post.categories,
      tags: post.tags,
    })));
  }

  return state;
}

export function categoriesReducer(state = [], action) {
  if (action.type === actionTypes.ADD_CATEGORIES) {
    return state.concat(action.payload.map(cat => ({
      title: cat.name,
      id: cat.id,
      description: cat.description,
      count: cat.count,
    })));
  }

  return state;
}

export function tagsReducer(state = [], action) {
  if (action.type === actionTypes.ADD_TAGS) {
    return state.concat(action.payload.map(tag => ({
      title: tag.name,
      id: tag.id,
      description: tag.description,
      count: tag.count,
    })));
  }

  return state;
}

/*
 * Combine reducers to produce single reducer for state.
 * Each reducer handles a sub-tree of the state tree based
 * on its name.
 */
export default combineReducers({
  posts: postsReducer,
  categories: categoriesReducer,
  tags: tagsReducer,
});
