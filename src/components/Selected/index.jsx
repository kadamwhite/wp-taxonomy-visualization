import React, { PropTypes } from 'react';
import { anyNode, taxonomyNode } from '../../prop-types';

import DangerousInline from '../DangerousInline';

import styles from './Selected.styl';

const Selected = ({ node, categories, tags }) => {
  if (!node) {
    return null;
  }
  return (
    <div className={styles.selected}>
      <h2><DangerousInline html={`${node.title} (#${node.id})`} /></h2>
      <a target="_blank" href={`http://bocoup.com?p=${node.id}`}>View {node.type}</a>
      {node.description ? (
        <p>{node.description}</p>
      ) : null}
      {categories && categories.length ? (
        <ul>
          <li>Categories:</li>
          {categories.map(cat => (<li>
            {cat}
          </li>))}
        </ul>
      ) : null}
      {tags && tags.length ? (
        <ul>
          <li>Tags:</li>
          {node.tags.map(tag => (<li>
            {tag}
          </li>))}
        </ul>
      ) : null}
    </div>
  );
}

Selected.propTypes = {
  node: anyNode,
  categories: PropTypes.arrayOf(taxonomyNode),
  tags: PropTypes.arrayOf(taxonomyNode),
};

export default Selected;
