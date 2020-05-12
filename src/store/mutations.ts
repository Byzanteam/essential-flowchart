import {
  IState, INode, IGraph, IPosition, ISelectable,
} from '@/types';

export default {
  updateGraph (state: IState, graph: IGraph) {
    state.graph = graph;
  },

  addNode (state: IState, node: INode) {
    state.graph.nodes[node.id] = node;
  },

  removeNode (state: IState, nodeId: string) {
    // remove link
    const { links } = state.graph;
    Object.values(links).forEach(link => {
      if (link.from.nodeId === nodeId || link.to.nodeId === nodeId) {
        delete links[link.id];
      }
    });

    // remove node
    delete state.graph.nodes[nodeId];
  },

  removeLink (state: IState, linkId: string) {
    delete state.graph.links[linkId];
  },

  setSelected (state: IState, item: ISelectable | null) {
    if (item) {
      state.selected = {
        // @ts-ignore
        type: isNode(item) ? 'node' : 'link',
        id: item.id,
      };
    } else {
      state.selected = null;
    }
  },

  dragNodeStop (state: IState, { nodeId, position }: { nodeId: string; position: IPosition }) {
    const node = state.graph.nodes[nodeId];

    if (node) {
      node.x = position.x;
      node.y = position.y;
    }
  },
};
