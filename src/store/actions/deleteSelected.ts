import { FlowchartContext } from '@/types';

export default function deleteSelected (
  { dispatch, commit, state }: FlowchartContext,
) {
  const { selected } = state;

  if (selected) {
    const updateSelectedFunc = () => commit('updateSelected', { selected: null });

    // eslint-disable-next-line default-case
    switch (selected.type) {
      case 'link':
        dispatch('removeLink', { linkId: selected.id })
          .then(updateSelectedFunc);
        break;

      case 'node':
        dispatch('removeNode', selected.id)
          .then(updateSelectedFunc);
        break;
    }
  }
}
