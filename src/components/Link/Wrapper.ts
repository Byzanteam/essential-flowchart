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

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const startPos = computed(() => fromNode.value.ports[props.link.from.portId].position!);
    const endPos = computed(() => {
      if (props.link.to.nodeId && props.link.to.portId) {
        const toNode = graph.value.nodes[props.link.to.nodeId];
        return toNode.ports[props.link.to.portId].position;
      }
      return props.link.to.position;
    });

    const path = computed(() => {
      if (endPos.value) {
        return generatePath(
          graph.value.grid,
          startPos.value,
          endPos.value!,
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
      if (endPos.value) {
        return createElement(props.linkComponent, {
          props: {
            link: props.link,

            startPos: startPos.value,
            endPos: endPos.value,

            path: path.value,
          },
        });
      }
      return null;
    };
  },
});
