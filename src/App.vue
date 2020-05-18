<template>
  <div id="app">
    <flow-chart :graph="graph">

    </flow-chart>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from '@vue/composition-api';
import { IGraph } from '@/types/graph';
import store from '@/store/index';
import { buildEmptyGrid } from '@/utils/grid';
import FlowChart from './components/FlowChart/FlowChart.vue';

// @ts-ignore
const graph: IGraph = {
  offset: [0, 0],
  scale: 1,
  nodes: {
    node1: {
      id: 'node1',
      x: 10,
      y: 10,
      width: 50,
      height: 50,
      ports: {
        top: {
          direction: 'top',
        },
        bottom: {
          direction: 'bottom',
        },
      },
    },
    node2: {
      id: 'node2',
      x: 100,
      y: 100,
      width: 50,
      height: 50,
      ports: {
        top: {
          direction: 'top',
        },
        bottom: {
          direction: 'bottom',
        },
      },
    },
    node3: {
      id: 'node3',
      x: 10,
      y: 80,
      width: 50,
      height: 50,
      ports: {
        top: {
          direction: 'top',
        },
        bottom: {
          direction: 'bottom',
        },
      },
    },
  },
  links: {
    link1: {
      id: 'link1',
      from: {
        nodeId: 'node1',
      },
      to: {
        nodeId: 'node2',
      },
    },
  },
  grid: buildEmptyGrid(1000, 1000),
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
