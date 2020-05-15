import Vue from 'vue';

import {
  IState, IGraph, Position, ILinkAttrs, ISelectable, PortDirection, IPosition,
} from '@/types';

import addNode from './mutations/addNode';

export default {
  addNode,

  updateGraph (state: IState, graph: IGraph) {
    state.graph = graph;
  },

  removeNode (state: IState, nodeId: string) {
    // remove link
    const { links } = state.graph;
    Object.values(links).forEach(link => {
      if (link.from.nodeId === nodeId || link.to.nodeId === nodeId) {
        Vue.delete(links, link.id);
      }
    });

    // remove node
    Vue.delete(state.graph.nodes, nodeId);
  },

  addLink (state: IState, linkAttrs: ILinkAttrs) {
    state.graph.links[linkAttrs.id] = linkAttrs;
  },

  removeLink (state: IState, linkId: string) {
    Vue.delete(state.graph.links, linkId);
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

  dragNode (state: IState, { nodeId, position }: { nodeId: string; position: IPosition }) {
    const node = state.graph.nodes[nodeId];

    if (node) {
      node.x = position.x;
      node.y = position.y;
    }
  },

  dragNodeStop (state: IState, { nodeId, position }: { nodeId: string; position: IPosition }) {
    const node = state.graph.nodes[nodeId];

    if (node) {
      node.x = position.x;
      node.y = position.y;
    }
  },

  updateNodePortPosition (state: IState, { nodeId, portDir, position }: { nodeId: string; portDir: PortDirection; position: Position }) {
    const node = state.graph.nodes[nodeId];
    if (node) {
      const port = node.ports[portDir];
      Vue.set(port, 'position', position);
    }
  },
};
