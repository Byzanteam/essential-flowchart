<template>
  <div id="app">
    <flow-chart :graph="graph">

    </flow-chart>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from '@vue/composition-api';
import { IStateAttrs, PortDirection } from '@/types';
import store from '@/store/index';
import FlowChart from './components/FlowChart/FlowChart.vue';

const graph: IStateAttrs = {
  // offset: [0, 0],
  // scale: 1,
  nodes: [
    {
      id: 'node1',
      rect: [20, 20, 50, 50],
      ports: [
        {
          id: 'port1',
          direction: PortDirection.BOTTOM,
        },
      ],
    },
    {
      id: 'node2',
      rect: [100, 100, 50, 50],
      ports: [
        {
          id: 'port1',
          direction: PortDirection.TOP,
        },
        {
          id: 'port2',
          direction: PortDirection.RIGHT,
        },
        {
          id: 'port3',
          direction: PortDirection.BOTTOM,
        },
        {
          id: 'port4',
          direction: PortDirection.LEFT,
        },
      ],
    },
    {
      id: 'node3',
      rect: [200, 180, 50, 50],
      ports: [
        {
          id: 'port1',
          direction: PortDirection.TOP,
        },
      ],
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
    FlowChart,
  },

  setup () {
    onMounted(() => {
      console.log(store);
    });

    return {
      graph,
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
