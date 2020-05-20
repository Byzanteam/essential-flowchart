import { createStore } from '../helper';

describe('dragNodeStop', () => {
  it('basic', () => {
    const node = {
      id: 'node1',
    };

    const moveTo = [500, 300];

    const store = createStore({
      stateAttrs: {
        graphNodeAttrs: [node],
      },
    });

    store.dispatch('dragNodeStop', { id: node.id, position: moveTo });

    const { x, y } = store.state.graph.nodes[node.id];

    expect(x).toEqual(moveTo[0]);
    expect(y).toEqual(moveTo[1]);
  });

  it('reversible', () => {
    const node = {
      id: 'node1',
    };

    const moveTo = [500, 300];

    const store = createStore({
      stateAttrs: {
        graphNodeAttrs: [node],
      },
    });

    const { x: originalX, y: originalY } = store.state.graph.nodes[node.id];

    store.dispatch('dragNodeStop', { id: node.id, position: moveTo });
    const { x: currentX, y: currentY } = store.state.graph.nodes[node.id];

    expect(currentX).toEqual(moveTo[0]);
    expect(currentY).toEqual(moveTo[1]);

    // undo
    store.dispatch('historyUndo');
    const { x: revertedX, y: revertedY } = store.state.graph.nodes[node.id];

    expect(revertedX).toEqual(originalX);
    expect(revertedY).toEqual(originalY);
  });
});
