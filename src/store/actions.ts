import addNode from './actions/addNode';
import removeNode from './actions/removeNode';

import dragNode from './actions/dragNode';
import dragNodeStop from './actions/dragNodeStop';
import deleteSelected from './actions/deleteSelected';

import historyActions from './actions/history';


export default {
  ...historyActions,
  addNode,
  removeNode,
  dragNode,
  dragNodeStop,
  deleteSelected,
};
