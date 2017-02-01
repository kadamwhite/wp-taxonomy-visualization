import CoincidenceMatrix from '../coincidence-matrix';

describe('CoincidenceMatrix', () => {
  let matrix;

  beforeEach(() => {
    matrix = new CoincidenceMatrix();
  });

  it('is a defined function', () => {
    expect(CoincidenceMatrix).toBeDefined();
    expect(CoincidenceMatrix).toBeInstanceOf(Function);
  });

  it('constructs a node tree', () => {
    expect(matrix.nodes).toBeDefined();
  });

  it('defines a #clear() method', () => {
    expect(matrix.clear).toBeDefined();
    expect(matrix.clear).toBeInstanceOf(Function);
  });

  it('defines a #set() method', () => {
    expect(matrix.set).toBeDefined();
    expect(matrix.set).toBeInstanceOf(Function);
  });

  it('defines a #has() method', () => {
    expect(matrix.has).toBeDefined();
    expect(matrix.has).toBeInstanceOf(Function);
  });

  it('defines a #for() method', () => {
    expect(matrix.for).toBeDefined();
    expect(matrix.for).toBeInstanceOf(Function);
  });

  it('defines a #uniqueIds() method', () => {
    expect(matrix.uniqueIds).toBeDefined();
    expect(matrix.uniqueIds).toBeInstanceOf(Function);
  });

  it('defines a #secondDegreePairs() method', () => {
    expect(matrix.secondDegreePairs).toBeDefined();
    expect(matrix.secondDegreePairs).toBeInstanceOf(Function);
  });

  it('can set and retrieve relationships between two IDs', () => {
    matrix.set(1, 16);
    matrix.set(16, 1);
    matrix.set(19, 1);
    expect(matrix.has(1, 16)).toBe(true);
    expect(matrix.has(1, 19)).toBe(true);
    expect(matrix.has(16, 19)).toBe(false);
  });

  it('can return a list of registered IDs', () => {
    matrix.set(1, 16);
    matrix.set(19, 7);
    expect(matrix.uniqueIds().sort()).toEqual(['1', '16', '19', '7']);
  });

  it('can return a list of registered pairs', () => {
    matrix.set(1, 16);
    matrix.set(16, 1);
    matrix.set(19, 7);
    expect(matrix.uniquePairs().sort()).toEqual([['1', '16'], ['19', '7']]);
  });

  it('can completely empty the matrix', () => {
    matrix.set(1, 16);
    matrix.clear();
    expect(matrix.has(1, 16)).toBe(false);
    expect(matrix.uniqueIds()).toEqual([]);
  });

  it('can return a list of IDs related to a provided ID', () => {
    matrix.set(1, 2);
    matrix.set(1, 3);
    matrix.set(1, 4);
    matrix.set(1, 5);
    matrix.set(1, 6);
    matrix.set(2, 3);
    matrix.set(2, 5);
    matrix.set(3, 4);
    matrix.set(4, 5);
    matrix.set(4, 6);
    matrix.set(5, 6);
    expect(matrix.for(1).sort()).toEqual(['2', '3', '4', '5', '6']);
  });

  it('can be used to retrieve second-degree connections', () => {
    matrix.set(1, 2);
    matrix.set(1, 3);
    matrix.set(1, 4);
    matrix.set(1, 5);
    matrix.set(1, 6);
    matrix.set(2, 3);
    matrix.set(2, 5);
    matrix.set(3, 4);
    matrix.set(4, 5);
    matrix.set(4, 6);
    matrix.set(5, 6);
    const sortByFirstMember = (a, b) => a[0] - b[0];
    const result1 = matrix.secondDegreePairs(1).sort(sortByFirstMember);
    expect(result1).toEqual([
      ['2', '3'],
      ['2', '5'],
      ['3', '4'],
      ['4', '5'],
      ['4', '6'],
      ['5', '6'],
    ]);
    const result2 = matrix.secondDegreePairs(2).sort(sortByFirstMember);
    expect(result2).toEqual([
      ['1', '3'],
      ['1', '5'],
    ]);
    const result4 = matrix.secondDegreePairs(4).sort(sortByFirstMember);
    expect(result4).toEqual([
      ['1', '3'],
      ['1', '5'],
      ['1', '6'],
      ['5', '6'],
    ]);
  });

});
