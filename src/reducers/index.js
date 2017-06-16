import { combineReducers } from 'redux';
import * as actionTypes from '../actions';

const formatTermId = term => `t${term}`;

export function postsReducer(state = [], action) {
  if (action.type === actionTypes.ADD_POSTS) {
    // Limit to only certain keys
    return state.concat(action.payload.map(post => ({
      title: post.title.rendered,
      id: post.id.toString(),
      categories: post.categories.map(formatTermId),
      tags: post.tags.map(formatTermId),
      type: post.type,
    })));
  }

  return state;
}

export function termsReducer(state = [], action) {
  if (action.type === actionTypes.ADD_TERMS) {
    return state.concat(action.payload.map(term => ({
      title: term.name,
      type: term.type,
      id: formatTermId(term.id),
      description: term.description,
      count: term.count,
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
  terms: termsReducer,
  selected: selectedNodeReducer,
});
