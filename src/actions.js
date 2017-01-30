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

export const ADD_TAGS = 'ADD_TAGS';
export function addTags(tags) {
  return {
    type: ADD_TAGS,
    payload: tags,
  };
}

export const ADD_CATEGORIES = 'ADD_CATEGORIES';
export function addCategories(cats) {
  return {
    type: ADD_CATEGORIES,
    payload: cats,
  };
}
