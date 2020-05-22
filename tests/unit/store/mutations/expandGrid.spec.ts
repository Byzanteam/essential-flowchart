import { IPosition } from '@/types';
import { createStore } from '../../../helper';

describe('expandGrid', () => {
  describe.each([
    [{ x: 500, y: 500 }, { x: 0, y: 0 }, 500],
    [{ x: -500, y: -500 }, { x: 500, y: 500 }, 500],
    [{ x: -500, y: 500 }, { x: 500, y: 0 }, 500],
    [{ x: 500, y: -500 }, { x: 0, y: 500 }, 500],
  ])('init grid offset { x: 0, y: 0 }, expand (%o)', (expansion: IPosition, expectedOffset, increase: number) => {
    const store = createStore({});

    const { width: prevWidth, height: prevHeight, pfGrid: prevPfGrid } = store.state.graph.grid;
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
  });

  describe.each([
    [{ x: 500, y: 500 }, { x: 0, y: 0 }, 1000],
    [{ x: -500, y: -500 }, { x: 1000, y: 1000 }, 1000],
    [{ x: -500, y: 500 }, { x: 1000, y: 0 }, 1000],
    [{ x: 500, y: -500 }, { x: 0, y: 1000 }, 1000],
  ])('init grid offset { x: 0, y: 0 }, expand (%o) twice', (expansion: IPosition, expectedOffset, increase: number) => {
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
});
