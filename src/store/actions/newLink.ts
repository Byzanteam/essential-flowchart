import { FlowchartContext, INewLink } from '@/types';

export default function newLink (
  { commit }: FlowchartContext,
  { link }: { link: INewLink },
) {
  commit({
    type: 'newLink',
    link: { ...link },
  });
}
