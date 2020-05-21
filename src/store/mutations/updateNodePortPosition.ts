import Vue from 'vue';
import {
  IState, Id, PortDirection, IPosition,
} from '@/types';

export default function updateNodePortPosition (state: IState, { nodeId, portDir, position }: { nodeId: Id; portDir: PortDirection; position: IPosition }) {
  const node = state.graph.nodes[nodeId];

  if (node) {
    const port = node.ports[portDir];
    // 响应式，link 会监视 port 的坐标进行寻路
    Vue.set(port, 'position', position);
  }
}
