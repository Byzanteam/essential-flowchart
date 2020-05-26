import { createStore } from '../../../helper';

describe('dragNodeStop', () => {
  it('basic', () => {
    const node = {
      id: 'node1',
    };

    const moveTo = { x: 500, y: 300 };

    const store = createStore({
      stateAttrs: {
        graphNodeAttrs: [node],
      },
    });

    store.dispatch('dragNodeStop', { id: node.id, position: moveTo });

    const { x, y } = store.state.graph.nodes[node.id];

    expect(x).toEqual(moveTo.x);
    expect(y).toEqual(moveTo.y);
  });

  it('reversible', () => {
    const node = {
      id: 'node1',
    };

    const moveTo = { x: 500, y: 300 };

    const store = createStore({
      stateAttrs: {
        graphNodeAttrs: [node],
      },
    });

    const { x: originalX, y: originalY } = store.state.graph.nodes[node.id];

    store.dispatch('dragNode', {
      id: node.id,
      position: moveTo,
      prevPosition: { x: originalX, y: originalY },
    });

    store.dispatch('dragNodeStop', {
      id: node.id,
      position: moveTo,
      prevPosition: { x: originalX, y: originalY },
    });
    const { x: currentX, y: currentY } = store.state.graph.nodes[node.id];

    expect(currentX).toEqual(moveTo.x);
    expect(currentY).toEqual(moveTo.y);

    // undo
    store.dispatch('historyUndo');
    const { x: revertedX, y: revertedY } = store.state.graph.nodes[node.id];

    expect(revertedX).toEqual(originalX);
    expect(revertedY).toEqual(originalY);
  });
});
