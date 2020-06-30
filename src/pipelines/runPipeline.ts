import { IState, ILink, ILinkPipelinePhase } from '@/types';

export default function runPipeline (
  link: ILink,
  state: IState,
  linkPipeline: ILinkPipelinePhase[],
): ILink | null {
  let result: ILink | null = link;

  let index = 0;

  while (result && index < linkPipeline.length) {
    const phase = linkPipeline[index];
    result = phase(link, state.graph);
    index += 1;
  }

  return result;
}
