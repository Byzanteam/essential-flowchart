import { IState, INewLink, ILink } from '@/types';

export default function runPipeline (
  link: INewLink | ILink,
  state: IState,
): INewLink | ILink | null {
  const { linkPipeline } = state.config;
  let result: INewLink | ILink | null = link;

  if (Array.isArray(linkPipeline)) {
    let index = 0;

    while (result && index < linkPipeline.length) {
      const phase = linkPipeline[index];
      result = phase(link, state.graph);
      index += 1;
    }
  }

  return result;
}
