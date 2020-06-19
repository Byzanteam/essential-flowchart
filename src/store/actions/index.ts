import addNode from './addNode';
import removeNode from './removeNode';

import dragNode from './dragNode';
import dragNodeStop from './dragNodeStop';

import addLink from './addLink';
import removeLink from './removeLink';

import updateScale from './updateScale';
import historyActions from './history';


export default {
  ...historyActions,
  addNode,
  removeNode,
  dragNode,
  dragNodeStop,

  addLink,
  removeLink,

  updateScale,
};
