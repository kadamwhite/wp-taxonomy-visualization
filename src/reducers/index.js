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
      id: post.id.toString(),
      categories: post.categories.map(term => `t${term}`),
      tags: post.tags.map(term => `t${term}`),
    })));
  }

  return state;
}

export function categoriesReducer(state = [], action) {
  if (action.type === actionTypes.ADD_CATEGORIES) {
    return state.concat(action.payload.map(cat => ({
      title: cat.name,
      id: `t${cat.id}`,
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
      id: `t${tag.id}`,
      description: tag.description,
      count: tag.count,
    })));
  }

  return state;
}

export function selectedNodeReducer(state = null, action) {
  if (action.type === actionTypes.SELECT_NODE) {
    // Only update if the selected item has changed
    return action.payload.id !== (state && state.id) ?
      Object.assign({}, action.payload) :
      state;
  }

  if (action.type === actionTypes.DESELECT_NODE) {
    return null;
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
  selected: selectedNodeReducer,
});
