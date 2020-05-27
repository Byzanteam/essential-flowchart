import addNode from './addNode';
import removeNode from './removeNode';
import updateNodePosition from './updateNodePosition';

import addLink from './addLink';
import removeLink from './removeLink';
import touchLink from './touchLink';
import moveLink from './moveLink';

import setSelected from './setSelected';

import expandGrid from './expandGird';

import historyMutations from './history';

export default {
  addNode,
  removeNode,
  updateNodePosition,

  addLink,
  removeLink,
  touchLink,
  moveLink,

  setSelected,

  expandGrid,

  ...historyMutations,
};
