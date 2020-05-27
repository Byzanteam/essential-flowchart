import {
  defineComponent, computed, PropType,
  createElement,
} from '@vue/composition-api';

import store from '@/store';
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
    const graph = computed(() => store.state.graph);

    const fromNode = computed(() => graph.value.nodes[props.link.from.nodeId]);
    const toNode = computed(() => graph.value.nodes[props.link.to.nodeId]);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const startPos = computed(() => fromNode.value.ports[props.link.from.portId].position!);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const endPos = computed(() => toNode.value.ports[props.link.to.portId].position!);

    const path = computed(() => generatePath(
      graph.value.grid,
      startPos.value,
      endPos.value,
      // track change
      store.state.linkVersions[props.link.id],
    ));

    return () => createElement(props.linkComponent, {
      props: {
        link: props.link,

        startPos: startPos.value,
        endPos: endPos.value,

        path: path.value,
      },
    });
  },
});
