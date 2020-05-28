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

import { useStore } from '@/hooks/store';
import {
  Point,
  IPosition,
  ILink,
  IGrid,
} from '@/types';

function generatePathCommands (path: Point[], grid: IGrid): string {
  if (!path.length) return '';

  const { x: gridOffsetX, y: gridOffsetY } = grid.offset;

  const [first, ...rest] = path;
  return rest.reduce(
    (acc, [x, y]) => `${acc} L${x - gridOffsetX} ${y - gridOffsetY}`,
    `M${first[0] - gridOffsetX} ${first[1] - gridOffsetY}`,
  );
}

export default defineComponent({
  name: 'LinkDefault',

  props: {
    link: {
      type: Object as PropType<ILink>,
      required: true,
    },

    startPos: {
      type: Object as PropType<IPosition>,
      required: true,
    },
    endPos: {
      type: Object as PropType<IPosition>,
      required: true,
    },

    path: {
      type: Array as PropType<Point[]>,
      required: true,
    },
  },

  setup (props) {
    const store = useStore();
    const pathCommands = computed(() => generatePathCommands(
      props.path,
      store.state.graph.grid,
    ));

    return {
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
