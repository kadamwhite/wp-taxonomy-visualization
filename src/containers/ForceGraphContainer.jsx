import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';

import { postNode, taxonomyNode } from '../prop-types';

import {
  // addPosts,
  // addTerms,
  selectNode,
  // deselectNode,
} from '../actions';

// import { getAllContent } from '../services/api';

import ForceGraph from '../components/ForceGraph';

class ForceGraphContainer extends PureComponent {

  componentDidMount() {
    // const { requestData } = this.props;
    // requestData().catch(e => console.error(e));
  }

  render() {
    const {
      posts,
      terms,
      // onDeselectNode,
      onSelectNode,
    } = this.props;

    return (
      <ForceGraph
        width={1200}
        height={600}
        posts={posts}
        terms={terms}
        onMouseOver={onSelectNode}
      />
    );
  }
}

ForceGraphContainer.propTypes = {
  // requestData: PropTypes.func.isRequired,
  onSelectNode: PropTypes.func.isRequired,
  posts: PropTypes.arrayOf(postNode).isRequired,
  terms: PropTypes.arrayOf(taxonomyNode).isRequired,
};

const mapStateToProps = state => ({
  posts: state.posts,
  terms: state.terms,
  // selectedNodeId: state.selected ? state.selected.id : null,
});

const mapDispatchToProps = dispatch => ({
  // requestData: () => getAllContent(
  //   posts => dispatch(addPosts(posts)),
  //   terms => dispatch(addTerms(terms)),
  // ),
  onSelectNode: node => dispatch(selectNode(node)),
  // onDeselectNode: () => dispatch(deselectNode())
});

export default connect(mapStateToProps, mapDispatchToProps)(ForceGraphContainer);
