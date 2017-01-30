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

class ForceGraph extends PureComponent {

  componentDidMount() {
    this.initSimulation();
  }

  componentDidUpdate() {
    if (this.simulation) {
      this.simulation.stop();
    }
    const graph = this.makeNodes();
    window.graph = graph;
    const svg = select(this.svg);
    const linksGroup = svg.select('.edges');
    const nodesGroup = svg.select('.nodes');

    const links = linksGroup
      .selectAll('line')
      .data(graph.edges)
      .enter()
        .append('line');

    const nodes = nodesGroup
      .selectAll('circle')
      .data(graph.nodes, d => d.id);
    nodes.enter()
      .append('circle')
        .attr('class', d => styles[d.type])
        .attr('r', d => d.type === 'post' ? 5 : 10)
        .attr('title', d => d.id);
    nodes.exit()
      .remove();

    this.simulation
      .nodes(graph.nodes)
      .on('tick', function onTick() {
        links
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y);

        nodes
          .attr('cx', d => d.x)
          .attr('cy', d => d.y);
      });

    this.simulation.force('links')
      .links(graph.edges);

    this.simulation.restart();
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
      .radius(d => d.r + 2.5);

    this.linkForce = forceLink()
      .id(d => d.id)
      .iterations(5);

    this.forceAlpha = 0.1;

    this.simulation = forceSimulation()
      .alpha(this.forceAlpha)
      .velocityDecay(0.2)
      .force('center', this.centeringForce)
      .force('collide', this.collisionForce)
      .force('links', this.linkForce)
      .on('tick', this.ticked);
  }

  makeNodes() {
    const { posts } = this.props;

    const nodes = [];
    const edges = [];
    const nodesMap = {};

    posts.forEach((post) => {
      const node = {
        title: post.title,
        id: `${post.id}`,
        type: 'post',
      };
      nodes.push(node);
      nodesMap[node.id] = node;

      post.categories.forEach((cat) => {
        if (!nodesMap[cat]) {
          const catNode = {
            title: '',
            id: `${cat}`,
            type: 'category',
          };
          nodes.push(catNode);
          nodesMap[catNode.id] = catNode;
        }

        edges.push({
          source: `${post.id}`,
          target: `${cat}`,
          value: 1,
        });
      });

      post.tags.forEach((tag) => {
        if (!nodesMap[tag]) {
          const tagNode = {
            title: '',
            id: `${tag}`,
            type: 'tag',
          };
          nodes.push(tagNode);
          nodesMap[tagNode.id] = tagNode;
        }

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
      nodesMap
    }
  }

  render() {
    const { posts, width, height } = this.props;

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
        <ul>{posts.map(post => (
          <li key={post.id}>
            <strong>
              <DangerousInline html={post.title} />
            </strong> ({post.id}): {post.categories.join()}, {post.tags.join()}
          </li>
        ))}</ul>
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
