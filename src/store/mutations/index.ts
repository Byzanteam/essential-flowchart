import addNode from './addNode';
import removeNode from './removeNode';
import updateNodePosition from './updateNodePosition';

import addLink from './addLink';
import removeLink from './removeLink';
import touchLink from './touchLink';
import updateLinkPath from './updateLinkPath';

import setSelected from './setSelected';

import expandGrid from './expandGird';

import updateMousePosition from './updateMousePosition';
import historyMutations from './history';

export default {
  addNode,
  removeNode,
  updateNodePosition,

  addLink,
  removeLink,
  touchLink,
  updateLinkPath,

  setSelected,

  expandGrid,

  updateMousePosition,
  ...historyMutations,
};
