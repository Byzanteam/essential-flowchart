import { computed } from '@vue/composition-api';

import { IStateInput, FlowchartStore } from '@/types';
import { buildState } from '@/utils/graph';

export default function useState (rawState: IStateInput, store: FlowchartStore) {
  buildState(rawState, store);
  const nodes = computed(() => store.state.graph.nodes);
  const links = computed(() => store.state.graph.links);

  return {
    nodes,
    links,
  };
}
