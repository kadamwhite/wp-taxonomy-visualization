/* eslint-disable no-console */
import React, { PureComponent, PropTypes } from 'react';
import { select } from 'd3';
import {
  forceSimulation,
  forceCenter,
  forceCollide,
  forceLink,
} from 'd3-force';

import DangerousInline from '../DangerousInline';

import styles from './ForceGraph.styl';

function radius(d) {
  return d.type === 'post' ? 5 : 10;
}

class ForceGraph extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      selectedNode: null
    };
  }

  componentDidMount() {
    this.initSimulation();

    if (this.props.posts.length) {
      // Data is pre-loaded! Let's get things going
      this.runSimulation();
    }
  }

  componentDidUpdate() {
    this.runSimulation();
  }

  runSimulation() {
    if (this.simulation) {
      this.simulation.stop();
    }
    const { width, height } = this.props;
    const graph = this.makeNodes();
    window.graph = graph;
    const svg = select(this.svg);
    const linksGroup = svg.select('.edges');
    const nodesGroup = svg.select('.nodes');

    const links = linksGroup
      .selectAll('line')
      .data(graph.edges);
    links.enter()
      .append('line')
        .attr('class', 'link');

    const nodes = nodesGroup
      .selectAll('circle')
      .data(graph.nodes, d => d.id);
    nodes.enter()
      .append('circle')
        .attr('class', d => `node ${styles[d.type]}`)
        .attr('r', d => radius(d))
        .attr('title', d => d.id);
    nodes.exit()
      .remove();

    this.simulation
      .nodes(graph.nodes)
      // eslint-disable-next-line prefer-arrow-callback
      .on('tick', function onTick() {
        linksGroup.selectAll('line.link')
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y);

        // See https://bl.ocks.org/mbostock/1129492 -- constrain the position
        // of nodes within the rectangular bounds of the containing SVG element.
        // As a side-effect of updating the node's cx and cy attributes, we
        // update the node positions to be within the range [radius, width - radius]
        // for x, [radius, height - radius] for y.
        nodesGroup.selectAll('circle.node')
          .attr('cx', d => (d.x = Math.max(radius(d), Math.min(width - radius(d), d.x))))
          .attr('cy', d => (d.y = Math.max(radius(d), Math.min(height - radius(d), d.y))));
      });

    this.simulation.force('links')
      .links(graph.edges);

    this.simulation.alpha(0.3).restart();
  }

  initSimulation() {
    if (this.simulation) {
      this.simulation.stop();
    }
    const { width, height } = this.props;
    this.centeringForce = forceCenter()
      .x(width / 2)
      .y(height / 2);

    this.collisionForce = forceCollide()
      .radius(d => 5 + (d.type === 'post' ? 5 : 10));

    this.linkForce = forceLink()
      .id(d => d.id)
      .strength(0)
      .iterations(5);

    this.forceAlpha = 0.1;

    this.simulation = forceSimulation()
      .alpha(this.forceAlpha)
      .velocityDecay(0.2)
      .force('center', this.centeringForce)
      .force('collide', this.collisionForce)
      .force('links', this.linkForce);
  }

  makeNodes() {
    const { posts, categories, tags } = this.props;

    const nodes = [];
    const edges = [];
    const nodesMap = {};

    categories.forEach((cat) => {
      nodes.push({
        title: cat.title,
        id: `${cat.id}`,
        type: 'category'
      });
    });

    tags.forEach((tag) => {
      nodes.push({
        title: tag.title,
        id: `${tag.id}`,
        type: 'tag'
      });
    });

    posts.forEach((post) => {
      const node = {
        title: post.title,
        id: `${post.id}`,
        type: 'post',
      };
      nodes.push(node);
      nodesMap[node.id] = node;

      post.categories.forEach((cat) => {
        edges.push({
          source: `${post.id}`,
          target: `${cat}`,
          value: 1,
        });
      });

      post.tags.forEach((tag) => {
        edges.push({
          source: `${post.id}`,
          target: `${tag}`,
          value: 1,
        });
      });
    });

    return {
      nodes,
      edges,
      nodesMap,
    };
  }

  render() {
    const { posts, width, height } = this.props;
    const { selectedNode } = this.state;

    return (
      <div>
        <svg
          ref={(node) => { this.svg = node; }}
          width={`${width}px`}
          height={`${height}px`}
        >
          <g className="edges" />
          <g className="nodes" />
        </svg>
        {selectedNode ? (
          <div>
            <h2><DangerousInline html={selectedNode.title} /></h2>
            {selectedNode.type === 'post' ?
              (<div>Post</div>) :
              selectedNode.type === 'category' ?
                (<div>Category</div>) :
                (<div>Tag</div>)}
          </div>
        ) : null}
        {/*
        <ul>{posts.map(post => (
          <li key={post.id}>
            <strong>
              <DangerousInline html={post.title} />
            </strong> ({post.id}): {post.categories.join()}, {post.tags.join()}
          </li>
        ))}</ul>
        */}
      </div>
    );
  }
}

ForceGraph.propTypes = {
  height: PropTypes.number.isRequired,
  posts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    categories: PropTypes.arrayOf(PropTypes.number),
    tags: PropTypes.arrayOf(PropTypes.number),
  })).isRequired,
  categories: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    count: PropTypes.number,
  })).isRequired,
  tags: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    count: PropTypes.number,
  })).isRequired,
  width: PropTypes.number.isRequired,
};

export default ForceGraph;
