import Vue from 'vue';

import {
  IState, IGraph, Position, ILinkAttrs, ISelectable,
  ILink,
} from '@/types';

import addNode from './mutations/addNode';
import removeNode from './mutations/removeNode';
import historyMutations from './mutations/history';

export default {
  addNode,
  removeNode,

  ...historyMutations,

  updateGraph (state: IState, graph: IGraph) {
    state.graph = graph;
  },


  addLink (state: IState, linkAttrs: ILinkAttrs) {
    state.graph.links[linkAttrs.id] = linkAttrs;
  },

  removeLink (state: IState, { link }: { link: ILink }) {
    Vue.delete(state.graph.links, link.id);
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
