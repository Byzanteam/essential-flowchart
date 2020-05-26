import {
  defineComponent, PropType,
  createElement,
} from '@vue/composition-api';
import { INode, INodePort } from '@/types';

type IFlowchartComponent = ReturnType<typeof defineComponent>;

export default defineComponent({
  name: 'PortWrapper',

  props: {
    portComponent: {
      type: Object as PropType<IFlowchartComponent>,
      required: true,
    },

    port: {
      type: Object as PropType<INodePort>,
      required: true,
    },

    node: {
      type: Object as PropType<INode>,
      required: true,
    },
  },

  setup (props) {
    return () => createElement(props.portComponent, {
      props: {
        port: props.port,
        node: props.node,
      },
    });
  },
});
