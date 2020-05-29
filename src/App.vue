<template>
  <div id="app">
    <flowchart :raw-state="rawState">

    </flowchart>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { IStateInput, PortDirection } from '@/types';
import Flowchart from './components/Flowchart/Flowchart.vue';

const rawState: IStateInput = {
  // offset: [0, 0],
  // scale: 1,
  nodes: [
    {
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
    {
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
    {
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
  ],
  links: [
    {
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
    {
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
  ],
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
</style>
