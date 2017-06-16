function incrementOrSet(val) {
  return val ? val + 1 : 1;
}

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
    this.nodes[id1][id2] = incrementOrSet(this.nodes[id1][id2]);
    this.nodes[id2] = this.nodes[id2] || {};
    this.nodes[id2][id1] = incrementOrSet(this.nodes[id2][id1]);
  }

  has(id1, id2) {
    return !!(this.nodes[id1] && this.nodes[id1][id2]);
  }

  degree(id1, id2) {
    return this.has(id1, id2) ? this.nodes[id1][id2] : 0;
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

  secondDegreePairs(targetId, ids = this.for(targetId)) {
    const uniquePairs = {};
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
