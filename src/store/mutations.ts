import addNode from './mutations/addNode';
import removeNode from './mutations/removeNode';
import updateNodePosition from './mutations/updateNodePosition';

import addLink from './mutations/addLink';
import removeLink from './mutations/removeLink';
import touchLink from './mutations/touchLink';
import updateLinkPath from './mutations/updateLinkPath';

import setSelected from './mutations/setSelected';

import expandGrid from './mutations/expandGird';

import historyMutations from './mutations/history';

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

  ...historyMutations,
};
