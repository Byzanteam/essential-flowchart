import Vue from 'vue';
import { IState, INode } from '@/types';
import emitter from '@/emitter';
import { NODE_SIZE_CHANGE } from '@/emitter/events';
import { markNodeWalkable } from '@/utils/grid';

// TODO: optimize with updateNodePosition
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

    let updatedNode = markNodeWalkable(
      state.graph.grid.pfGrid,
      state.graph.grid.offset,
      {
        ...node,
        ...prevSize,
      },
      true,
      state.config,
    );

    updatedNode = markNodeWalkable(
      state.graph.grid.pfGrid,
      state.graph.grid.offset,
      {
        ...updatedNode,
        ...size,
      },
      false,
      state.config,
    );

    Vue.set(nodes, id, updatedNode);

    emitter.emit(NODE_SIZE_CHANGE, {
      node: updatedNode,
      size,
      prevSize,
    });
  }
}
