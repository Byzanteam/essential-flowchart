import Vuex, { Store, MutationTree, ActionTree } from 'vuex';
import allMutations from '@/store/mutations';
import allActions from '@/store/actions';
import {
  Id,
  INodePort,
  ILinkPort,
  PortDirection,
  IState,
  ISelectedOrHovered,
} from '@/types';

import { buildEmptyGrid } from '@/utils/grid';

type NodeRect = [number, number, number, number];

const defaultGridDimension: [number, number] = [1440, 900];
const defaultNodeRect: NodeRect = [200, 100, 100, 40];
const defaultPorts = [
  {
    id: '1',
    direction: PortDirection.TOP,
  },
  {
    id: '2',
    direction: PortDirection.RIGHT,
  },
  {
    id: '3',
    direction: PortDirection.BOTTOM,
  },
  {
    id: '4',
    direction: PortDirection.LEFT,
  },
];

interface IStateAttrs {
  gridDimension?: [number, number];
  graphNodeAttrs?: {id: Id; rect?: NodeRect; ports?: INodePort[]}[];
  graphNodeIds?: Id[];
  graphLinkAttrs?: {
    id: Id;
    from: ILinkPort;
    to: ILinkPort;
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
    && stateAttrs.graphNodeAttrs.forEach(({ id, rect, ports }) => {
      const [x, y, width, height] = rect || defaultNodeRect;

      store.commit('addNode', {
        node: {
          id,
          x,
          y,
          width,
          height,
          ports: ports || defaultPorts,
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
          ports: defaultPorts,
        },
      });
    });
}

function buildLinks (store: Store<IState>, stateAttrs?: IStateAttrs) {
  if (!stateAttrs) return;
  if (!stateAttrs.graphLinkAttrs) return;

  stateAttrs.graphLinkAttrs.forEach(({
    id,
    from: { nodeId: fromNodeId, portId: fromPortId },
    to: { nodeId: toNodeId, portId: toPortId },
  }) => {
    store.commit('addLink', {
      link: {
        id,
        from: { nodeId: fromNodeId, portId: fromPortId },
        to: { nodeId: toNodeId, portId: toPortId },
      },
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
        offset: {
          x: 0,
          y: 0,
        },

        nodes: {},
        links: {},

        grid: {
          offset: {
            x: 0,
            y: 0,
          },
          ...buildEmptyGrid(width, height),
        },
      },
      linkVersions: {},
      selected: (stateAttrs && stateAttrs.selected) || null,
    },
    mutations: mutations || allMutations,
    actions: actions || allActions,
  });

  buildNodes(store, stateAttrs);
  buildLinks(store, stateAttrs);

  return store;
}
