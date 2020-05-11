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

const graph: IGraph = {
  offset: {
    x: 0,
    y: 0,
  },
  scale: 1,
  nodes: {
    node1: {
      id: 'node1',
      position: {
        x: 0,
        y: 0,
      },
    },
    node2: {
      id: 'node2',
      position: {
        x: 150,
        y: 150,
      },
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

      store.commit('increment');
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
