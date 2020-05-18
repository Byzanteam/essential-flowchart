import Vuex, { Store, MutationTree, ActionTree } from 'vuex';
import allMutations from '@/store/mutations';
import allActions from '@/store/actions';
import {
  ID,
  IState,
  NodeRect,
  PortDirection,
  ISelectedOrHovered,
} from '@/types';

import { buildEmptyGrid } from '@/utils/grid';

const defaultGridDimension: [number, number] = [1440, 900];
const defaultNodeRect: NodeRect = [200, 100, 100, 40];
const defaultPortDirection = PortDirection.Bottom;

interface IStateAttrs {
  gridDimension?: [number, number];
  graphNodeAttrs?: {id: ID; rect?: NodeRect}[];
  graphNodeIds?: ID[];
  graphLinkAttrs?: {
    id: ID;
    from: {
      nodeId: ID;
      direction?: PortDirection;
    };
    to: {
      nodeId: ID;
      direction?: PortDirection;
    };
  }[];

  selected?: ISelectedOrHovered | null;
}

interface ICreateStoreObject<T> {
  stateAttrs?: IStateAttrs;
  mutations?: MutationTree<T>;
  actions?: ActionTree<T, T>;
}

function buildNodes (store: Store<IState>, stateAttrs?: IStateAttrs) {
  if (!stateAttrs) return;

  stateAttrs.graphNodeAttrs
    && stateAttrs.graphNodeAttrs.forEach(({ id, rect }) => {
      const [x, y, width, height] = rect || defaultNodeRect;

      store.commit('addNode', {
        node: {
          id,
          x,
          y,
          width,
          height,
          ports: [],
        },
      });
    });

  stateAttrs.graphNodeIds
    && stateAttrs.graphNodeIds.forEach(id => {
      const [x, y, width, height] = defaultNodeRect;

      store.commit('addNode', {
        node: {
          id,
          x,
          y,
          width,
          height,
          ports: [],
        },
      });
    });
}

function buildLinks (store: Store<IState>, stateAttrs?: IStateAttrs) {
  if (!stateAttrs) return;
  if (!stateAttrs.graphLinkAttrs) return;

  stateAttrs.graphLinkAttrs.forEach(({
    id,
    from: { nodeId: fromNodeId, direction: fromPortDirection },
    to: { nodeId: toNodeId, direction: toPortDirection },
  }) => {
    store.commit('addLink', {
      id,
      from: { nodeId: fromNodeId, direction: fromPortDirection || defaultPortDirection },
      to: { nodeId: toNodeId, direction: toPortDirection || defaultPortDirection },
    });
  });
}

// eslint-disable-next-line import/prefer-default-export
export function createStore (
  {
    stateAttrs,
    mutations,
    actions,
  }: ICreateStoreObject<IState>,
): Store<IState> {
  const [width, height] = (
    stateAttrs && stateAttrs.gridDimension
  ) || defaultGridDimension;

  const store: Store<IState> = new Vuex.Store({
    state: {
      history: {
        currentVersion: 0,
        entries: [],
      },
      graph: {
        offset: [0, 0],

        nodes: {},
        links: {},

        grid: buildEmptyGrid(width, height),
      },
      selected: (stateAttrs && stateAttrs.selected) || null,
    },
    mutations: mutations || allMutations,
    actions: actions || allActions,
  });

  buildNodes(store, stateAttrs);
  buildLinks(store, stateAttrs);

  return store;
}
