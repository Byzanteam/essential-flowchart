import Vue from 'vue';
import { IState, INode } from '@/types';
import emitter from '@/emitter';
import { NODE_SIZE_CHANGE } from '@/emitter/events';
import { calcPortPosition } from '@/utils/graph';

export default function updateNodeSize (
  state: IState,
  { id, width, height }: Pick<INode, 'id' | 'width' | 'height'>,
) {
  const { nodes } = state.graph;
  const node = nodes[id];

  if (node) {
    const size = {
      width,
      height,
    };

    const prevSize = {
      width: node.width,
      height: node.height,
    };

    const ports = calcPortPosition(
      Object.values(node.ports),
      {
        x: node.x, y: node.y, width, height,
      },
      state.config.portGap,
    );

    Vue.set(nodes, id, {
      ...node,
      ...size,
      ports,
    });

    emitter.emit(NODE_SIZE_CHANGE, {
      node: nodes[id],
      size,
      prevSize,
    });
  }
}
