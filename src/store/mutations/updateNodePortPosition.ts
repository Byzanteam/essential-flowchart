import Vue from 'vue';
import {
  IState, ID, PortDirection, IPosition,
} from '@/types';

export default function updateNodePortPosition (state: IState, { nodeId, portDir, position }: { nodeId: ID; portDir: PortDirection; position: IPosition }) {
  const node = state.graph.nodes[nodeId];

  if (node) {
    const port = node.ports[portDir];
    Vue.set(port, 'position', position);
  }
}
