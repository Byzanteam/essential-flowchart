import addNode from './addNode';
import removeNode from './removeNode';
import updateNodePosition from './updateNodePosition';
import updateNodeSize from './updateNodeSize';

import addLink from './addLink';
import removeLink from './removeLink';
import touchLink from './touchLink';
import updateLinkPath from './updateLinkPath';
import deleteLinkPath from './deleteLinkPath';

import updateSelected from './updateSelected';

import updateGrid from './updateGrid';
import expandGrid from './expandGird';

import updateMousePosition from './updateMousePosition';
import updateScale from './updateScale';
import updateOffset from './updateOffset';
import updateConfig from './updateConfig';
import historyMutations from './history';

export default {
  addNode,
  removeNode,
  updateNodePosition,
  updateNodeSize,

  addLink,
  removeLink,
  touchLink,
  updateLinkPath,
  deleteLinkPath,

  updateSelected,

  updateGrid,
  expandGrid,

  updateMousePosition,
  updateScale,
  updateOffset,
  updateConfig,
  ...historyMutations,
};
