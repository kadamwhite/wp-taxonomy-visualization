import { PropTypes } from 'react';

export const taxonomyNode = PropTypes.shape({
  title: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  description: PropTypes.string,
  count: PropTypes.number,
});

export const postNode = PropTypes.shape({
  title: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  categories: PropTypes.arrayOf(PropTypes.number),
  tags: PropTypes.arrayOf(PropTypes.number),
});

export const anyNode = PropTypes.shape({
  title: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  categories: PropTypes.arrayOf(PropTypes.number),
  tags: PropTypes.arrayOf(PropTypes.number),
  description: PropTypes.string,
  count: PropTypes.number,
});
