import {
  IState, INode, IGraph, IPosition,
} from '@/types';

export default {
  updateGraph (state: IState, graph: IGraph) {
    state.graph = graph;
  },

  addNode (state: IState, node: INode) {
    state.graph.nodes[node.id] = node;
  },

  removeNode (state: IState, nodeId: string) {
    delete state.graph.nodes[nodeId];

    // TODO: remove link, reset selected node
  },

  dragNodeStop (state: IState, { nodeId, position }: { nodeId: string; position: IPosition }) {
    const node = state.graph.nodes[nodeId];

    if (node) {
      node.x = position.x;
      node.y = position.y;
    }
  },
};
