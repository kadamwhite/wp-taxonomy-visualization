export const ADD_POSTS = 'ADD_POSTS';
export function addPosts(posts) {
  return {
    type: ADD_POSTS,
    payload: posts,
  };
}

export const ADD_TERMS = 'ADD_TERMS';
export function addTerms(terms) {
  return {
    type: ADD_TERMS,
    payload: terms,
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
