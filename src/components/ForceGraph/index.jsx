import React, { PureComponent, PropTypes } from 'react';
import { select, mouse } from 'd3-selection';
import {
  forceSimulation,
  forceManyBody,
  forceCenter,
  forceCollide,
  forceLink,
} from 'd3-force';
import debounce from 'lodash.debounce';
import { postNode, taxonomyNode } from '../../prop-types';
import classes from './ForceGraph.styl';

const classSelectors = Object.keys(classes)
  .reduce((selectors, className) => Object.assign({
    [className]: `.${classes[className]}`,
  }, selectors), {});

function radius(d) {
  return d.type === 'post' ? 5 : 10;
}

class ForceGraph extends PureComponent {

  constructor(props) {
    super(props);

    this.graph = {
      nodes: [],
      edges: [],
      nodesMap: {},
      edgesMap: {},
    };

    this.state = {
      selectedNode: null,
    };
  }

  componentDidMount() {
    this.initSimulation();

    if (this.props.posts.length) {
      // Data is pre-loaded! Let's get things going
      this.runSimulation();
    }
  }

  shouldComponentUpdate() {
    this.runSimulation();
    return false;
  }

  runSimulation() {
    if (this.simulation) {
      this.simulation.stop();
    }
    const graph = this.makeNodes();
    const svg = select(this.svg);
    const linksGroup = svg.select('.edges');
    const nodesGroup = svg.select('.nodes');

    const links = linksGroup
      .selectAll('line')
      .data(graph.edges);
    links.enter().append('line')
        .classed(classes.edge, true);

    const nodes = nodesGroup
      .selectAll('circle')
      .data(graph.nodes, d => d.id);
    nodes.exit().remove();
    nodes.enter().append('circle')
      .attr('class', d => `${classes.node} ${classes[d.type]}`)
      .attr('r', d => radius(d))
      .attr('title', d => d.id);

    this.simulation.nodes(graph.nodes);
    this.simulation.force('links').links(graph.edges);
    this.simulation.alpha(0.3).restart();
  }

  initSimulation() {
    const { width, height, onMouseOver } = this.props;
    this.centeringForce = forceCenter()
      .x(width / 2)
      .y(height / 2);

    this.chargeForce = forceManyBody().strength(-200);

    this.collisionForce = forceCollide()
      .radius(d => 5 + (d.type === 'post' ? 5 : 10));

    this.linkForce = forceLink()
      .id(d => d.id)
      // .strength(0)
      .iterations(5);

    const svg = select(this.svg);
    const linksGroup = svg.select('.edges');
    const nodesGroup = svg.select('.nodes');

    let tickCount = 0;
    this.simulation = forceSimulation()
      .alpha(0.1)
      .velocityDecay(0.2)
      .force('center', this.centeringForce)
      .force('charge', this.chargeForce)
      .force('collide', this.collisionForce)
      .force('links', this.linkForce)
      // eslint-disable-next-line prefer-arrow-callback
      .on('tick', function onTick() {
        // Update on every other tick;
        if (tickCount < 2) {
          tickCount += 1;
          return;
        }
        linksGroup.selectAll(classSelectors.edge)
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y);

        nodesGroup.selectAll(classSelectors.node)
          .attr('transform', (d) => {
            // See https://bl.ocks.org/mbostock/1129492 -- constrain the position
            // of nodes within the rectangular bounds of the containing SVG element.
            // As a side-effect of updating the node's cx and cy attributes, we
            // update the node positions to be within the range [radius, width - radius]
            // for x, [radius, height - radius] for y.
            /* eslint-disable no-param-reassign */
            d.x = Math.max(radius(d), Math.min(width - radius(d), d.x));
            d.y = Math.max(radius(d), Math.min(height - radius(d), d.y));
            /* eslint-enale no-param-reassign */
            return `translate(${d.x},${d.y})`;
          });

        tickCount = 0;
      });

    const selectNearest = debounce(([x, y]) => {
      const node = this.simulation.find(x, y, 50);
      if (!node) {
        // svg.selectAll(classSelectors.node).classed(classes.selected, false);
        return;
      }
      svg.selectAll(classSelectors.node).classed(classes.selected, d => d === node);
      onMouseOver(node);
    }, 10);
    svg.on('mousemove', function onMouseMove() {
      selectNearest(mouse(this));
    });
  }

  makeNodes() {
    const { width, height, posts, categories, tags } = this.props;
    const oldNodesMap = this.graph.nodesMap;
    const oldEdgesMap = this.graph.edgesMap;

    // We will be updating this.graph with new properties
    const nodes = [];
    const edges = [];
    const nodesMap = {};
    const edgesMap = {};

    // Function to retrieve an existing node, if present, so that X & Y are
    // preserved, but other values updated; otherwise, the provided node is
    // new and therefore added to the new node list as-is.
    // Returns the node.
    function createOrUpdateNode(node) {
      const newNode = oldNodesMap[node.id] ?
        Object.assign({}, oldNodesMap[node.id], node) :
        Object.assign({
          // Initial position in center
          x: width / 2,
          y: height / 2,
        }, node);
      nodesMap[newNode.id] = newNode;
      nodes.push(newNode);
      return newNode;
    }

    function createOrUpdateEdge(edge) {
      const key = `${edge.source},${edge.target}`;
      const newEdge = oldEdgesMap[key] ?
        Object.assign({}, oldEdgesMap[key], edge) :
        edge;
      edgesMap[key] = newEdge;
      edges.push(newEdge);
      return newEdge;
    }

    // Populate new array and dictionary with taxonomy information
    [
      { collection: categories, type: 'category' },
      { collection: tags, type: 'tag' },
    ].forEach(taxonomy => taxonomy.collection.forEach((term) => {
      createOrUpdateNode({
        title: term.title,
        id: term.id,
        description: term.description,
        count: term.count,
        type: taxonomy.type,
      });
    }));

    // Populate new array and dictionary with post object information
    [
      posts,
    ].forEach(postTypeCollection => postTypeCollection.forEach((post) => {
      createOrUpdateNode({
        title: post.title,
        id: post.id,
        categories: post.categories,
        tags: post.tags,
        type: 'post',
      });

      [
        { collection: post.categories, type: 'category' },
        { collection: post.tags, type: 'tag' },
      ].forEach(taxonomy => taxonomy.collection.forEach((term) => {
        // D3 will throw an error if an edge is encountered for a node that
        // does not exist, so ensure the relevant node has been created
        if (!nodesMap[term]) {
          createOrUpdateNode({
            title: '',
            id: term.toString(),
            description: '',
            count: 1,
            type: taxonomy.type,
          });
        }
        createOrUpdateEdge({
          source: post.id,
          target: term.toString(),
          count: nodesMap[term].count,
        });
      }));
    }));

    // Update graph object
    this.graph.nodes = nodes;
    this.graph.nodesMap = nodesMap;
    this.graph.edges = edges;
    this.graph.edgesMap = edgesMap;

    return this.graph;
  }

  render() {
    const { width, height } = this.props;

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
      </div>
    );
  }
}

ForceGraph.propTypes = {
  // selectedNodeId: PropTypes.number,
  onMouseOver: PropTypes.func.isRequired,
  // onMouseOut: PropTypes.func.isRequired,
  height: PropTypes.number.isRequired,
  posts: PropTypes.arrayOf(postNode).isRequired,
  categories: PropTypes.arrayOf(taxonomyNode).isRequired,
  tags: PropTypes.arrayOf(taxonomyNode).isRequired,
  width: PropTypes.number.isRequired,
};

export default ForceGraph;
