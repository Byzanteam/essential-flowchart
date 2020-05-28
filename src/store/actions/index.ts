import addNode from './addNode';
import removeNode from './removeNode';

import dragNode from './dragNode';
import dragNodeStop from './dragNodeStop';
import deleteSelected from './deleteSelected';

import addLink from './addLink';
import removeLink from './removeLink';

import historyActions from './history';


export default {
  ...historyActions,
  addNode,
  removeNode,
  dragNode,
  dragNodeStop,
  deleteSelected,

  addLink,
  removeLink,
};
