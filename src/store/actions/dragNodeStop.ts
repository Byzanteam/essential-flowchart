import { FlowChartContext, Position } from '@/types';

// TODO
export default function ({ commit }: FlowChartContext, { id, position }: { id: string; position: Position }) {
  commit('dragNodeStop', { nodeId: id, position });
}
