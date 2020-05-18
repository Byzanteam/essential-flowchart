import addNode from './mutations/addNode';
import removeNode from './mutations/removeNode';
import dragNodeStop from './mutations/dragNodeStop';

import addLink from './mutations/addLink';
import removeLink from './mutations/removeLink';

import setSelected from './mutations/setSelected';
import updateGraph from './mutations/updateGraph';

import historyMutations from './mutations/history';

export default {
  addNode,
  removeNode,
  dragNodeStop,

  addLink,
  removeLink,

  setSelected,
  updateGraph,

  ...historyMutations,
};
