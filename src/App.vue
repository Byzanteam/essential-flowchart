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
  nodes: [{
    id: 'node1',
    rect: [10, 10, 50, 50],
  }, {
    id: 'node2',
    rect: [100, 100, 50, 50],
  }, {
    id: 'node3',
    rect: [10, 80, 50, 50],
  }],
  links: [{
    id: 'link1',
    from: {
      nodeId: 'node1',
      direction: PortDirection.BOTTOM,
    },
    to: {
      nodeId: 'node2',
      direction: PortDirection.BOTTOM,
    },
  }],
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
