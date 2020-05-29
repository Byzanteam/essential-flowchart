import { computed } from '@vue/composition-api';

import { FlowchartStore, Id } from '@/types';

export default function useSelected (store: FlowchartStore) {
  const selected = computed(() => store.state.selected);

  function isNodeSelected (nodeId: Id) {
    return !!(selected.value
      && selected.value.type === 'node'
      && selected.value.id === nodeId
    );
  }

  function isLinkSelected (linkId: Id) {
    return !!(selected.value
      && selected.value.type === 'link'
      && selected.value.id === linkId
    );
  }

  return {
    isNodeSelected,
    isLinkSelected,
  };
}
