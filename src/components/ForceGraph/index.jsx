import React, { PureComponent, PropTypes } from 'react';
import { select, mouse } from 'd3-selection';
import {
  forceSimulation,
  forceManyBody,
  forceCenter,
  forceCollide,
  forceLink,
} from 'd3-force';
import {
  scaleOrdinal,
  schemeCategory10,
} from 'd3-scale';
import debounce from 'lodash.debounce';
import { postNode, taxonomyNode } from '../../prop-types';
import classes from './ForceGraph.styl';
import { valueChanged } from '../../utils/object-utils';
import CoincidenceMatrix from '../../utils/coincidence-matrix';

const classSelectors = Object.keys(classes)
  .reduce((selectors, className) => Object.assign({
    [className]: `.${classes[className]}`,
  }, selectors), {});

function radius(d) {
  return d.type === 'post' ? 5 : 10;
}

function isTerm(node) {
  return node.type === 'category' || node.type === 'tag' || node.type === 'post_tag';
}

class ForceGraph extends PureComponent {

  constructor(props) {
    super(props);

    this.graph = {
      nodes: [],
      // edges: [],
      nodesMap: {},
      // edgesMap: {},
    };

    this.colorScale = scaleOrdinal(schemeCategory10);

    this.coincidence = {
      all: new CoincidenceMatrix(),
      terms: new CoincidenceMatrix(),
    };

    this.state = {
      selectedNode: null,
    };
  }

  componentDidMount() {
    this.initSimulation();

    if (this.props.posts.length) {
      // Data is pre-loaded! Let's get things going
      this.makeNodes();
      this.runSimulation();
    }
  }

  shouldComponentUpdate(nextProps) {
    const dataPropsChanged = valueChanged(this.props, nextProps, ['posts', 'terms']);
    const dimensionsChanged = valueChanged(this.props, nextProps, ['width', 'height']);
    // const selectionChanged = valueChanged(this.state, nextState, ['selectedNode']);

    // Update the node list if the data has changed
    if (dataPropsChanged) {
      this.makeNodes();
    }

    // Update the simulation if any data OR dimensions have changed
    if (dataPropsChanged || dimensionsChanged) {
      this.runSimulation();
    }

    return false;
  }

  filterNodes() {
    const graph = this.graph;
    const selectedNode = this.state.selectedNode;
    // We will be updating this.graph with new properties
    const filteredNodes = [];
    const filteredEdges = [];

    window.graph = graph;

    if (selectedNode) {
      filteredNodes.push(selectedNode);
      const coincidentIds = this.coincidence.all.for(selectedNode.id);
      // Storing and re-using the coincidentIds array reduces the number of
      // times we need to iterate over every node
      coincidentIds.forEach((coincidentId) => {
        filteredNodes.push(graph.nodesMap[coincidentId]);
        filteredEdges.push({
          source: selectedNode.id,
          target: coincidentId,
        });
      });
      this.coincidence.terms.secondDegreePairs(selectedNode.id, coincidentIds).forEach((pair) => {
        filteredEdges.push({
          source: pair[0],
          target: pair[1],
        });
      });
    } else {
      // Push all term nodes into the filtered nodes array
      graph.nodes.forEach(node => isTerm(node) && filteredNodes.push(node));
      // Push all term relation pairs into the filtered edges array
      this.coincidence.terms.uniquePairs().forEach(([source, target]) => filteredEdges.push({
        source,
        target,
      }));
    }

    window.filtered = {
      nodes: filteredNodes,
      edges: filteredEdges,
    }

    return {
      nodes: filteredNodes,
      edges: filteredEdges,
    };
  }

  isSelectedNode(id) {
    const { selectedNode } = this.state;
    return !!(selectedNode && (selectedNode.id === id));
  }

  runSimulation() {
    if (this.simulation) {
      this.simulation.stop();
    }

    const { selectedNode } = this.state;
    const filteredGraph = this.filterNodes();

    const svg = select(this.svg);
    const linksGroup = svg.select('.edges');
    const nodesGroup = svg.select('.nodes');

    const displayEdges = selectedNode ?
      filteredGraph.edges.filter(edge => (
        !this.isSelectedNode(edge.source) && !this.isSelectedNode(edge.target)
      )) :
      filteredGraph.edges;
    window.filtered.displayEdges = displayEdges;

    const links = linksGroup
      .selectAll('line')
      .data(displayEdges, (d) => {
        const { source, target } = d;
        return [source, target].sort().join();
      });
    links.exit()
      .remove();
    links.enter().append('line')
      .classed(classes.edge, true);

    const nodes = nodesGroup
      .selectAll('circle')
      .data(filteredGraph.nodes, d => d.id);
    nodes.exit().remove();
    /* eslint-disable no-shadow */// Need to re-declare selectedNode
    const enteringNodes = nodes.enter().append('circle')
      .attr('title', d => d.id)
      .on('click', (d) => {
        if (this.isSelectedNode(d.id)) {
          this.setState({
            selectedNode: null,
          }, this.runSimulation);
        } else {
          this.setState({
            selectedNode: d,
          }, this.runSimulation);
        }
      });
    nodes.merge(enteringNodes)
      .attr('r', d => radius(d))
      .attr('class', d => `${classes.node} ${classes[d.type]}`)
      .classed(classes.selected, d => this.isSelectedNode(d.id));

    this.simulation.nodes(filteredGraph.nodes);
    this.simulation.force('links').links(filteredGraph.edges);
    this.simulation.alpha(0.3).restart();
  }

  initSimulation() {
    const { width, height, onMouseOver } = this.props;
    this.centeringForce = forceCenter()
      .x(width / 2)
      .y(height / 2);

    this.chargeForce = forceManyBody().strength(-600);

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
            /* eslint-enable no-param-reassign */
            return `translate(${d.x},${d.y})`;
          });

        tickCount = 0;
      });

    const selectNearest = debounce(([x, y]) => {
      const node = this.simulation.find(x, y, 50);
      if (!node) {
        // svg.selectAll(classSelectors.node).classed(classes.hover, false);
        return;
      }
      svg.selectAll(classSelectors.node).classed(classes.hover, d => d === node);
      onMouseOver(node);
    }, 10);
    svg.on('mousemove', function onMouseMove() {
      selectNearest(mouse(this));
    });
  }

  makeNodes() {
    const { width, height, posts, terms } = this.props;
    const oldNodesMap = this.graph.nodesMap;

    // We will be updating this.graph with new properties
    const nodes = [];
    const edges = [];
    const nodesMap = {};

    // Function to retrieve an existing node, if present, so that X & Y are
    // preserved, but other values updated; otherwise, the provided node is
    // new and therefore added to the new node list as-is.
    // Returns the node.
    function createOrUpdateNode(node) {
      const newNode = oldNodesMap[node.id] ?
        Object.assign(oldNodesMap[node.id], node) :
        Object.assign({
          // Initial position in center
          x: width / 2,
          y: height / 2,
        }, node);
      nodesMap[newNode.id] = newNode;
      nodes.push(newNode);
      return newNode;
    }

    const uniqueTypes = {};

    // Populate new array and dictionary with taxonomy information
    terms.forEach((term) => {
      createOrUpdateNode({
        title: term.title,
        id: term.id,
        description: term.description,
        count: term.count,
        type: term.type,
      });
      uniqueTypes[term.type] = true;
    });

    // Populate new array and dictionary with post object information
    posts.forEach((post) => {
      createOrUpdateNode({
        title: post.title,
        id: post.id,
        categories: post.categories,
        tags: post.tags,
        type: post.type,
      });
      uniqueTypes[post.type] = true;

      const cats = Array.isArray(post.categories) ?
        post.categories.map(term => ({ id: term, type: 'category' })) :
        [];
      const tags = Array.isArray(post.tags) ?
        post.tags.map(term => ({ id: term, type: 'tag' })) :
        [];
      const categoriesAndTags = cats.concat(tags);
      categoriesAndTags.forEach((term) => {
        // D3 will throw an error if an edge is encountered for a node that
        // does not exist, so ensure the relevant node has been created
        if (!nodesMap[term]) {
          createOrUpdateNode({
            title: '',
            id: term.id.toString(),
            description: '',
            count: 1,
            type: term.type,
          });
        }
      });
    });

    this.colorScale.domain(Object.keys(uniqueTypes));

    this.coincidence.all.clear();
    this.coincidence.terms.clear();
    window.coincidence = this.coincidence;

    // Categories and tags relate to each other only indirectly
    nodes.filter(node => !isTerm(node)).forEach((node) => {
      // Build a representation of what tags coincide
      const cats = Array.isArray(node.categories) ? node.categories : [];
      const tags = Array.isArray(node.tags) ? node.tags : [];
      const categoriesAndTags = cats.concat(tags);
      categoriesAndTags.forEach((termId) => {
        categoriesAndTags.forEach((coincidentTermId) => {
          // The post relates to each term
          this.coincidence.all.set(node.id, termId);
          this.coincidence.all.set(node.id, coincidentTermId);
          // The terms are also related
          this.coincidence.all.set(termId, coincidentTermId);
          // Store one separate matrix containing only terms, for use when a
          // node has not been selected
          this.coincidence.terms.set(termId, coincidentTermId);
        });
      });
    });

    // Update graph object
    this.graph.nodes = nodes;
    this.graph.nodesMap = nodesMap;
    // this.graph.edges = edges;
    // this.graph.edgesMap = edgesMap;

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
  terms: PropTypes.arrayOf(taxonomyNode).isRequired,
  width: PropTypes.number.isRequired,
};

export default ForceGraph;
