import { FlowchartContext, ILink } from '@/types';

export default function newLink (
  { commit, state }: FlowchartContext,
  { link }: { link: ILink },
): boolean {
  const { validateLink } = state.config;
  let isValid = true;

  if (validateLink) {
    isValid = validateLink(link, state.graph);
  }

  if (isValid) {
    const mutation = {
      type: 'newLink',
      link: { ...link },
    };

    commit(mutation);
  }

  return isValid;
}
