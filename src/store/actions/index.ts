import addNode from './addNode';
import removeNode from './removeNode';

import dragNode from './dragNode';
import dragNodeStop from './dragNodeStop';
import deleteSelected from './deleteSelected';
import selectNode from './selectNode';

import newLink from './newLink';
import discardLink from './discardLink';

import addLink from './addLink';
import removeLink from './removeLink';
import selectLink from './selectLink';


import historyActions from './history';


export default {
  ...historyActions,
  addNode,
  removeNode,
  dragNode,
  dragNodeStop,
  selectNode,
  deleteSelected,

  newLink,
  discardLink,

  addLink,
  removeLink,
  selectLink,
};
