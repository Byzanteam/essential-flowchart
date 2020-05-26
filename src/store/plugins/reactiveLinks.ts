import {
  Id,
  IState,
  FlowchartStore,
  ILink,
} from '@/types';

export default function reactiveLinks (store: FlowchartStore) {
  store.subscribe((mutation, state: IState) => {
    if (mutation.type === 'updateNodePosition') {
      const nodeId: Id = mutation.payload.node.id;

      Object.values(state.graph.links).forEach((link: ILink) => {
        if (link.from.nodeId !== nodeId || link.from.nodeId !== nodeId) {
          store.commit('touchLink', { linkId: link.id });
        }
      });
    }
  });
}
