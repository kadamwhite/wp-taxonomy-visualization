import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  forceSimulation,
  forceCenter,
  forceCollide,
  forceLink,
} from 'd3-force';

import { addPosts } from '../../actions';

import DangerousInline from '../DangerousInline';

import { getAllPosts } from '../../services/api';

class ForceGraph extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      width: 500,
      height: 300,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    getAllPosts((posts) => {
      dispatch(addPosts(posts));
    });
    this.initSimulation();
  }

  initSimulation() {
    if (this.simulation) {
      this.simulation.stop();
    }
    const { width, height } = this.state;
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

  render() {
    const { posts } = this.props;
    const { width, height } = this.state;

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
              <DangerousInline html={post.title.rendered} />
            </strong> ({post.id}): {post.categories.join()}, {post.tags.join()}
          </li>
        ))}</ul>
      </div>
    );
  }
}

ForceGraph.propTypes = {
  dispatch: PropTypes.func.isRequired,
  posts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.shape({
      rendered: PropTypes.string.isRequired,
    }),
    categories: PropTypes.arrayOf(PropTypes.number),
    tags: PropTypes.arrayOf(PropTypes.number),
  })).isRequired,
};

const mapStateToProps = state => ({
  posts: state.posts,
});

export default connect(mapStateToProps)(ForceGraph);
