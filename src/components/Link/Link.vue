<template>
  <svg class="link">
    <circle
      :cx="startPos.x"
      :cy="startPos.y"
      r="4"
    />

    <path
      :d="pathCommands"
      stroke="blue"
      strokeWidth="3"
      fill="none"
    />

    <circle
      :cx="endPos.x"
      :cy="endPos.y"
      r="4"
    />
  </svg>
</template>

<script lang="ts">
import {
  defineComponent, computed, PropType,
} from '@vue/composition-api';

import store from '@/store';
import {
  ILink,
  IGrid,
} from '@/types';
import { SCALE_FACTOR } from '@/utils/grid';

import generatePath from './utils/generatePath';

type Point = [number, number];

function generatePathCommands (path: Point[], grid: IGrid): string {
  if (!path.length) return '';

  const { x: gridOffsetX, y: gridOffsetY } = grid.offset;

  const [first, ...rest] = path;
  return rest.reduce(
    (acc, [x, y]) => `${acc} L${x * SCALE_FACTOR - gridOffsetX} ${y * SCALE_FACTOR - gridOffsetY}`,
    `M${first[0] * SCALE_FACTOR - gridOffsetX} ${first[1] * SCALE_FACTOR - gridOffsetY}`,
  );
}

export default defineComponent({
  name: 'Link',

  props: {
    link: {
      type: Object as PropType<ILink>,
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
    const endPos = computed(() => toNode.value.ports[props.link.from.portId].position!);

    const pathCommands = computed(() => generatePathCommands(
      generatePath(graph.value.grid, startPos.value, endPos.value),
      graph.value.grid,
    ));

    return {
      startPos,
      endPos,

      pathCommands,
    };
  },
});
</script>

<style lang="scss">
.link {
  cursor: pointer;
  left: 0;
  overflow: visible;
  position: absolute;
  right: 0;
}
</style>
