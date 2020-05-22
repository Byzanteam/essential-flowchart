import { IOffset } from '@/types';
import { createStore } from '../../../helper';

describe('expandGrid', () => {
  describe.each([
    [{ x: 500, y: 500 }, { x: 0, y: 0 }, 500],
    [{ x: -500, y: -500 }, { x: 500, y: 500 }, 500],
    [{ x: -500, y: 500 }, { x: 500, y: 0 }, 500],
    [{ x: 500, y: -500 }, { x: 0, y: 500 }, 500],
  ])('init grid offset { x: 0, y: 0 }, expand (%o)', (expansion: IOffset, expectedOffset, increase: number) => {
    const store = createStore({
      stateAttrs: {
        graphNodeAttrs: [{
          id: 'node1',
          rect: [10, 10, 50, 50],
        }, {
          id: 'node2',
          rect: [100, 100, 50, 50],
        }, {
          id: 'node3',
          rect: [10, 80, 50, 50],
        }],
      },
    });

    const { width: prevWidth, height: prevHeight, pfGrid: prevPfGrid } = store.state.graph.grid;
    const prevNodes = store.state.graph.nodes;
    store.commit('expandGrid', expansion);

    test(`offset change to { x: ${expectedOffset.x}, y: ${expectedOffset.y} }`, () => {
      expect(store.state.graph.grid.offset).toEqual(expectedOffset);
    });

    test(`grid width and height will increase ${increase}`, () => {
      expect(store.state.graph.grid.width).toEqual(prevWidth + increase);
      expect(store.state.graph.grid.height).toEqual(prevHeight + increase);
    });

    test('a new pfgrid instance will be created', () => {
      expect(store.state.graph.grid.pfGrid).not.toBe(prevPfGrid);
    });

    test('node position will not change', () => {
      const { nodes } = store.state.graph;
      Object.keys(nodes).forEach(id => {
        expect(nodes[id].x).toBe(prevNodes[id].x);
        expect(nodes[id].y).toBe(prevNodes[id].y);
      });
    });
  });

  describe.each([
    [{ x: 500, y: 500 }, { x: 0, y: 0 }, 1000],
    [{ x: -500, y: -500 }, { x: 1000, y: 1000 }, 1000],
    [{ x: -500, y: 500 }, { x: 1000, y: 0 }, 1000],
    [{ x: 500, y: -500 }, { x: 0, y: 1000 }, 1000],
  ])('init grid offset { x: 0, y: 0 }, expand (%o) twice', (expansion: IOffset, expectedOffset, increase: number) => {
    const store = createStore({});

    const { width: prevWidth, height: prevHeight } = store.state.graph.grid;
    store.commit('expandGrid', expansion);
    store.commit('expandGrid', expansion); // expand twice

    test(`offset change to { x: ${expectedOffset.x}, y: ${expectedOffset.y} }`, () => {
      expect(store.state.graph.grid.offset).toEqual(expectedOffset);
    });

    test(`grid width and height will increase ${increase}`, () => {
      expect(store.state.graph.grid.width).toEqual(prevWidth + increase);
      expect(store.state.graph.grid.height).toEqual(prevHeight + increase);
    });
  });

  describe('expand top 300 and left 200 then expand bottom 300 and right 800', () => {
    const store = createStore({});

    const { width: prevWidth, height: prevHeight } = store.state.graph.grid;
    store.commit('expandGrid', { x: -200, y: -300 });
    store.commit('expandGrid', { x: 800, y: 300 });

    test('offset change to { x: 200, y: 300 }', () => {
      expect(store.state.graph.grid.offset).toEqual({ x: 200, y: 300 });
    });

    test('grid will have width 1000 and height 600 increased', () => {
      expect(store.state.graph.grid.width).toEqual(prevWidth + 1000);
      expect(store.state.graph.grid.height).toEqual(prevHeight + 600);
    });
  });
});
