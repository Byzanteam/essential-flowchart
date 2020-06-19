import { IState } from '@/types';

export default function updateReadonly (state: IState, readonly: boolean) {
  state.config.readonly = readonly;
}
