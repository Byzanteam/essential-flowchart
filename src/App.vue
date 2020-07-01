<template>
  <div id="app">
    <flowchart
      :nodes="state.nodes"
      :links="state.links"
      :config="{
        scale: state.scale,
        offset: state.offset,
      }"
      @node-size-change="handleNodeSizeChange"
      @node-position-change="handleNodePositionChange"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from '@vue/composition-api';
import { PortDirection } from '@/types';
import Flowchart from './components/Flowchart/Flowchart.vue';

const rawState = {
  offset: {
    x: 100,
    y: 100,
  },
  scale: 0.8,
  nodes: {
    node1: {
      id: 'node1',
      x: -100,
      y: 50,
      width: 50,
      height: 50,
      ports: {
        port1: {
          id: 'port1',
          direction: PortDirection.BOTTOM,
        },
      },
    },
    node2: {
      id: 'node2',
      x: 100,
      y: -100,
      width: 50,
      height: 50,
      ports: {
        port1: {
          id: 'port1',
          direction: PortDirection.TOP,
        },
        port2: {
          id: 'port2',
          direction: PortDirection.RIGHT,
        },
        port3: {
          id: 'port3',
          direction: PortDirection.BOTTOM,
        },
        port4: {
          id: 'port4',
          direction: PortDirection.LEFT,
        },
      },
    },
    node3: {
      id: 'node3',
      x: 300,
      y: 100,
      width: 50,
      height: 50,
      ports: {
        port1: {
          id: 'port1',
          direction: PortDirection.TOP,
        },
        port2: {
          id: 'port2',
          direction: PortDirection.RIGHT,
        },
        port3: {
          id: 'port3',
          direction: PortDirection.BOTTOM,
        },
        port4: {
          id: 'port4',
          direction: PortDirection.LEFT,
        },
      },
    },
    node4: {
      id: 'node4',
      x: 500,
      y: 150,
      width: 50,
      height: 50,
      ports: {
        port1: {
          id: 'port1',
          direction: PortDirection.TOP,
        },
        port2: {
          id: 'port2',
          direction: PortDirection.RIGHT,
        },
        port3: {
          id: 'port3',
          direction: PortDirection.BOTTOM,
        },
        port4: {
          id: 'port4',
          direction: PortDirection.LEFT,
        },
      },
    },
    node5: {
      id: 'node5',
      x: 1000,
      y: 300,
      width: 50,
      height: 50,
      ports: {
        port1: {
          id: 'port1',
          direction: PortDirection.TOP,
        },
        port2: {
          id: 'port2',
          direction: PortDirection.RIGHT,
        },
        port3: {
          id: 'port3',
          direction: PortDirection.BOTTOM,
        },
        port4: {
          id: 'port4',
          direction: PortDirection.LEFT,
        },
      },
    },
    node6: {
      id: 'node6',
      x: 1000,
      y: 600,
      width: 50,
      height: 50,
      ports: {
        port1: {
          id: 'port1',
          direction: PortDirection.TOP,
        },
        port2: {
          id: 'port2',
          direction: PortDirection.RIGHT,
        },
        port3: {
          id: 'port3',
          direction: PortDirection.BOTTOM,
        },
        port4: {
          id: 'port4',
          direction: PortDirection.LEFT,
        },
      },
    },
  },
  links: {
    link1: {
      id: 'link1',
      from: {
        nodeId: 'node1',
        portId: 'port1',
      },
      to: {
        nodeId: 'node2',
        portId: 'port1',
      },
    },
    link2: {
      id: 'link2',
      from: {
        nodeId: 'node2',
        portId: 'port1',
      },
      to: {
        nodeId: 'node3',
        portId: 'port1',
      },
    },
    link3: {
      id: 'link3',
      from: {
        nodeId: 'node3',
        portId: 'port2',
      },
      to: {
        nodeId: 'node4',
        portId: 'port4',
      },
    },
    link4: {
      id: 'link4',
      from: {
        nodeId: 'node3',
        portId: 'port3',
      },
      to: {
        nodeId: 'node5',
        portId: 'port2',
      },
    },
    link5: {
      id: 'link5',
      from: {
        nodeId: 'node3',
        portId: 'port4',
      },
      to: {
        nodeId: 'node6',
        portId: 'port1',
      },
    },
  },
};

export default defineComponent({
  name: 'App',

  components: {
    Flowchart,
  },

  setup () {
    const state = reactive(rawState);

    return {
      state,
      // eslint-disable-next-line
      handleNodeSizeChange (event: any) {
        const { node, width, height } = event;
        node.width = width;
        node.height = height;
      },
      // eslint-disable-next-line
      handleNodePositionChange (event: any) {
        const { node, position } = event;
        node.x = position.x;
        node.y = position.y;
      },
    };
  },
});
</script>

<style lang="scss">
html
body {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.canvas {
  background-color: rgba(green, 0.5);

  &__outer {
    background-color: purple;
  }
}
</style>
