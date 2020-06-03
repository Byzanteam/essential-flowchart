import Vue from 'vue';
import { IState, IConfigInput } from '@/types';
import { buildConfig } from '@/utils/config';

export default function updateConfig (state: IState, config: IConfigInput) {
  Vue.set(state, 'config', buildConfig(config));
}
