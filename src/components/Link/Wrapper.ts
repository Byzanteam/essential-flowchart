import {
  defineComponent, computed, watch, PropType,
  createElement,
} from '@vue/composition-api';

import { useStore } from '@/hooks/store';
import { ILink } from '@/types';

import generatePath from './utils/generatePath';

type IFlowchartComponent = ReturnType<typeof defineComponent>;

export default defineComponent({
  name: 'LinkWrapper',

  props: {
    link: {
      type: Object as PropType<ILink>,
      required: true,
    },
    linkComponent: {
      type: Object as PropType<IFlowchartComponent>,
      required: true,
    },
  },

  setup (props) {
    const store = useStore();
    const graph = computed(() => store.state.graph);

    const fromNode = computed(() => graph.value.nodes[props.link.from.nodeId]);

    const startPort = computed(() => fromNode.value.ports[props.link.from.portId]);
    const endPort = computed(() => {
      if (props.link.to.nodeId && props.link.to.portId) {
        const toNode = graph.value.nodes[props.link.to.nodeId];
        return toNode.ports[props.link.to.portId];
      }
      if (store.state.mousePosition) {
        return {
          position: store.state.mousePosition,
        };
      }
      return null;
    });

    const path = computed(() => {
      if (endPort.value) {
        return generatePath(
          graph.value.grid,
          startPort.value,
          endPort.value,
          store.state.config,
          // track change
          store.state.linkVersions[props.link.id],
        );
      }
      return [];
    });

    watch(path, newPath => store.commit(
      'updateLinkPath',
      { linkId: props.link.id, path: [...newPath] },
    ));

    return () => {
      if (endPort.value) {
        return createElement(props.linkComponent, {
          props: {
            link: props.link,

            startPos: startPort.value.position,
            endPos: endPort.value.position,

            path: path.value,
          },
        });
      }
      return null;
    };
  },
});
