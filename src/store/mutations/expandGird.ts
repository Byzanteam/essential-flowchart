import { IState } from '@/types';
import { buildEmptyGrid, markNodeWalkable } from '@/utils/grid';

export default function expandGrid (state: IState, expansion: number) {
  // eslint-disable-next-line prefer-const
  let { offset: prevOffset, width, height } = state.graph.grid;

  const negative = expansion < 0;
  // eslint-disable-next-line no-param-reassign
  expansion = Math.abs(expansion);

  width += expansion;
  height += expansion;

  const { pfGrid } = buildEmptyGrid(width, height);
  const offset = {
    x: negative ? prevOffset.x + expansion : prevOffset.x,
    y: negative ? prevOffset.y + expansion : prevOffset.y,
  };

  state.graph.grid = {
    width,
    height,
    pfGrid,
    offset,
  };

  Object.values(state.graph.nodes).forEach(node => {
    markNodeWalkable(
      pfGrid,
      [node.x + offset.x, node.y + offset.y, node.width, node.height],
      false,
    );
  });
}
