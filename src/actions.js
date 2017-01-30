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

export const SELECT_NODE = 'SELECT_NODE';
export function selectNode(node) {
  return {
    type: SELECT_NODE,
    payload: node,
  };
}

export const DESELECT_NODE = 'DESELECT_NODE';
export function deselectNode() {
  return {
    type: DESELECT_NODE,
  };
}
