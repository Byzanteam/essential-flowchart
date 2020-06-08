<template>
  <div id="app">
    <flowchart :state="rawState" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { PortDirection } from '@/types';
import Flowchart from './components/Flowchart/Flowchart.vue';

const rawState = {
  // offset: [0, 0],
  scale: 0.8,
  nodes: {
    node1: {
      id: 'node1',
      x: 200,
      y: 200,
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
      x: 150,
      y: 290,
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
      y: 480,
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
  },
};

export default defineComponent({
  name: 'App',

  components: {
    Flowchart,
  },

  setup () {
    return {
      rawState,
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
  background-color: purple;

  &__inner {
    background-color: rgba(green, 0.5);
  }
}
</style>
