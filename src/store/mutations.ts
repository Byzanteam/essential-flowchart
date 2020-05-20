import addNode from './mutations/addNode';
import removeNode from './mutations/removeNode';
import dragNode from './mutations/dragNode';
import dragNodeStop from './mutations/dragNodeStop';

import addLink from './mutations/addLink';
import removeLink from './mutations/removeLink';

import updateNodePortPosition from './mutations/updateNodePortPosition';

import setSelected from './mutations/setSelected';

import historyMutations from './mutations/history';

export default {
  addNode,
  removeNode,
  dragNode,
  dragNodeStop,

  addLink,
  removeLink,

  updateNodePortPosition,

  setSelected,

  ...historyMutations,
};
