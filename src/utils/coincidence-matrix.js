export default class CoincidenceMatrix {
  constructor() {
    this.nodes = {};
  }

  clear() {
    this.nodes = {};
  }

  set(id1, id2) {
    if (id1 === id2) {
      return;
    }
    this.nodes[id1] = this.nodes[id1] || {};
    this.nodes[id1][id2] = true;
    this.nodes[id2] = this.nodes[id2] || {};
    this.nodes[id2][id1] = true;
  }

  has(id1, id2) {
    return !!(this.nodes[id1] && this.nodes[id1][id2]);
  }

  for(id) {
    return Object.keys(this.nodes[id]);
  }

  uniqueIds() {
    const uniqueKeys = {};
    Object.keys(this.nodes).forEach((id) => {
      uniqueKeys[id] = true;
      Object.keys(this.nodes[id]).forEach((coincidentId) => {
        uniqueKeys[coincidentId] = true;
      });
    });
    return Object.keys(uniqueKeys);
  }

  uniquePairs() {
    const uniquePairs = {};
    Object.keys(this.nodes).forEach((id) => {
      Object.keys(this.nodes[id]).forEach((coincidentId) => {
        if (id === coincidentId) {
          return;
        }
        const key = [id, coincidentId].sort().join(',');
        uniquePairs[key] = true;
      });
    });
    return Object.keys(uniquePairs).map(pair => pair.split(','));
  }

  secondDegreePairs(id) {
    const uniquePairs = {};
    const ids = this.for(id);
    ids.forEach((id) => {
      ids.forEach((coincidentId) => {
        if (this.has(id, coincidentId)) {
          const key = [id, coincidentId].sort().join(',');
          uniquePairs[key] = true;
        }
      });
    });
    return Object.keys(uniquePairs).map(pair => pair.split(','));
  }

}
