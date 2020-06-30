import setLinks from './setLinks';
import setNodes from './setNodes';
import addNode from './addNode';
import removeNode from './removeNode';
import updateNodePosition from './updateNodePosition';
import updateNodeSize from './updateNodeSize';

import addLink from './addLink';
import removeLink from './removeLink';

import updateMousePosition from './updateMousePosition';
import updateScale from './updateScale';
import updateReadonly from './updateReadonly';
import updateOffset from './updateOffset';
import updateConfig from './updateConfig';
import historyMutations from './history';

export default {
  setNodes,
  setLinks,
  addNode,
  removeNode,
  updateNodePosition,
  updateNodeSize,

  addLink,
  removeLink,

  updateMousePosition,
  updateScale,
  updateReadonly,
  updateOffset,
  updateConfig,
  ...historyMutations,
};
