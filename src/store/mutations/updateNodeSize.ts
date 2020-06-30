import { IState, INode } from '@/types';
import emitter from '@/emitter';
import { NODE_SIZE_CHANGE } from '@/emitter/events';

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

    node.width = width;
    node.height = height;

    emitter.emit(NODE_SIZE_CHANGE, {
      node: nodes[id],
      size,
      prevSize,
    });
  }
}
