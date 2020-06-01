import addNode from './addNode';
import removeNode from './removeNode';
import updateNodePosition from './updateNodePosition';

import newLink from './newLink';
import discardLink from './discardLink';

import addLink from './addLink';
import removeLink from './removeLink';
import touchLink from './touchLink';
import updateLinkPath from './updateLinkPath';

import updateSelected from './updateSelected';

import expandGrid from './expandGird';

import updateMousePosition from './updateMousePosition';
import historyMutations from './history';

export default {
  addNode,
  removeNode,
  updateNodePosition,

  newLink,
  discardLink,

  addLink,
  removeLink,
  touchLink,
  updateLinkPath,

  updateSelected,

  expandGrid,

  updateMousePosition,
  ...historyMutations,
};
