import { IState, INewLink, ILink } from '@/types';

export default function runPipeline (
  link: INewLink | ILink,
  state: IState,
): INewLink | ILink | null {
  const { linkPipeline } = state.config;
  let result = null;

  if (Array.isArray(linkPipeline)) {
    let index = 0;

    while (result && index < linkPipeline.length) {
      const linkValidation = linkPipeline[index];
      result = linkValidation(link, state.graph);
      index += 1;
    }
  }

  return result;
}
