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
import FlowChart from './components/FlowChart/FlowChart.vue';

// @ts-ignore
const graph: IGraph = {
  offset: {
    x: 0,
    y: 0,
  },
  scale: 1,
  nodes: {
    node1: {
      id: 'node1',
      x: 0,
      y: 0,
      width: 10,
      height: 10,
      ports: [],
    },
    node2: {
      id: 'node2',
      x: 150,
      y: 150,
      width: 10,
      height: 10,
      ports: [],
    },
  },
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
