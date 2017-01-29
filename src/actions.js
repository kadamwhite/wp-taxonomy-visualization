export const SET_POSTS = 'SET_POSTS';
export function setPosts(posts) {
  return {
    type: SET_POSTS,
    payload: posts,
  };
}

export const ADD_POSTS = 'ADD_POSTS';
export function addPosts(posts) {
  return {
    type: ADD_POSTS,
    payload: posts,
  };
}
