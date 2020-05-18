import addNode from './actions/addNode';
import removeNode from './actions/removeNode';

import dragNodeStop from './actions/dragNodeStop';
import deleteSelected from './actions/deleteSelected';

import historyActions from './actions/history';


export default {
  ...historyActions,
  addNode,
  removeNode,
  dragNodeStop,
  deleteSelected,
};
