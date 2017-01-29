import { combineReducers } from 'redux';
import { SET_POSTS, ADD_POSTS } from '../actions';
import { pick } from '../util';

export function postsReducer(state = [], action) {
  if (action.type === SET_POSTS) {
    return action.payload;
  }

  if (action.type === ADD_POSTS) {
    // Limit to only certain keys
    return state.concat(action.payload.map(post => pick(post, [
      'title',
      'id',
      'categories',
      'tags',
    ])));
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
});
