import { IState, INode } from '@/types';

import markNodeWalkable from '../../components/Node/utils/markNodeWalkable';

export default function (state: IState, node: INode) {
  const { pfGrid } = state.graph.grid;
  markNodeWalkable(
    pfGrid,
    [node.x, node.y, node.width, node.height],
    false,
  );

  state.graph.nodes[node.id] = node;
}
