import { IPosition } from '@/types/generics';
import { INode } from '@/types/graph';

// 缩放因子
const SCALE_FACTOR = 1;

// 默认节点尺寸
const DEFAULT_NODE_SIZE = {
  width: 200,
  height: 200,
};

// 根据节点计算矩阵大小
function getMatrixDimensions (offset: IPosition, nodes: INode[]) {
  const dimensions = { width: 0, height: 0 };

  // 坐标轴原点从 0 开始
  const offsetX = Math.max(offset.x, 0);
  const offsetY = Math.max(offset.y, 0);

  nodes.forEach(node => {
    const size = DEFAULT_NODE_SIZE; // TODO: 可以扩展 node 的 size 属性

    // 计算节点距离原点的坐标
    // 使矩阵的尺寸能够包含所有节点
    const x = offsetX + node.position.x + size.width;
    const y = offsetY + node.position.y + size.height;

    if (x > dimensions.width) dimensions.width = x;
    if (y > dimensions.height) dimensions.height = y;
  });

  return dimensions;
}

function getEmptyMatrix (width: number, height: number): Array<number[]> {
  // 向上取整，保证能包含所有节点
  const adjustedWidth = Math.ceil(width / SCALE_FACTOR);
  const adjustedHeight = Math.ceil(height / SCALE_FACTOR);

  const matrix = [];

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < adjustedHeight; i++) {
    // find path 时 0 表示 walkable
    matrix.push(new Array(adjustedWidth).fill(0));
  }

  return matrix;
}

function getMatrix (offset: IPosition, nodes: INode[]): Array<number[]> {
  // 矩阵的宽高
  const { width, height } = getMatrixDimensions(offset, nodes);
  const matrix = getEmptyMatrix(width, height); // 空矩阵，每个点都 walkable

  nodes.forEach(node => {
    const { position } = node;
    const size = DEFAULT_NODE_SIZE; // TODO: 可以扩展 node 的 size 属性

    const scaledSize = {
      width: Math.ceil(size.width / SCALE_FACTOR),
      height: Math.ceil(size.height / SCALE_FACTOR),
    };

    const scaledPosition = {
      x: Math.ceil(position.x / SCALE_FACTOR),
      y: Math.ceil(position.y / SCALE_FACTOR),
    };

    // 将节点在矩阵上占据的空间标记为 1
    // find path 时 1 表示 unwalkable
    // eslint-disable-next-line no-plusplus
    for (let { x } = scaledPosition; x < scaledPosition.x + scaledSize.width; x++) {
      // eslint-disable-next-line no-plusplus
      for (let { y } = scaledPosition; y < scaledPosition.y + scaledSize.height; y++) {
        matrix[x][y] = 1;
      }
    }
  });

  return matrix;
}

export default getMatrix;
