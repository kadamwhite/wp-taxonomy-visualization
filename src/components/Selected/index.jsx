import React, { PropTypes } from 'react';
import { anyNode, taxonomyNode } from '../../prop-types';

import DangerousInline from '../DangerousInline';

import styles from './Selected.styl';

const Selected = ({ node, categories, tags }) => (
  <div className={styles.selected}>
    <h2>
      {node.type ? `${node.type.replace(/^\w/, node.type[0].toUpperCase())}: ` : null}
      <DangerousInline html={`${node.title} (#${node.id})`} /></h2>
    {node.type === 'post' ? (<a
      target="_blank"
      rel="noopener noreferrer"
      href={`http://bocoup.com?p=${node.id}`}
    >
      View {node.type}
    </a>) : null}
    {node.description ? (
      <p>{node.description}</p>
    ) : null}
    {categories && categories.length ? (
      <ul>
        <li>Categories:</li>
        {categories.map(cat => (<li key={`cat${cat.id}`}>
          <DangerousInline html={`${cat.title} (#${cat.id})`} />
        </li>))}
      </ul>
    ) : null}
    {tags && tags.length ? (
      <ul>
        <li>Tags:</li>
        {tags.map(tag => (<li key={`tag${tag.id}`}>
          <DangerousInline html={`${tag.title} (#${tag.id})`} />
        </li>))}
      </ul>
    ) : null}
  </div>
);

Selected.propTypes = {
  node: anyNode.isRequired,
  categories: PropTypes.arrayOf(taxonomyNode).isRequired,
  tags: PropTypes.arrayOf(taxonomyNode).isRequired,
};

export default Selected;
