import Vue from 'vue';

import {
  IState, IGraph, Position, ILinkAttrs, ISelectable,
} from '@/types';

import addNode from './mutations/addNode';
import pushEntry from './mutations/history/pushEntry';

export default {
  addNode,
  pushEntry,

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

  dragNodeStop (state: IState, { nodeId, position }: { nodeId: string; position: Position }) {
    const node = state.graph.nodes[nodeId];

    if (node) {
      [node.x, node.y] = position;
    }
  },
};
