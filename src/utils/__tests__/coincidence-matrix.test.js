import CoincidenceMatrix from '../coincidence-matrix';

describe('objectToList', () => {
  it('is a defined function', () => {
    expect(CoincidenceMatrix).toBeDefined();
    expect(CoincidenceMatrix).toBeInstanceOf(Function);
  });

  it('constructs a node tree', () => {
    const matrix = new CoincidenceMatrix();
    expect(matrix.nodes).toBeDefined();
  });
});
