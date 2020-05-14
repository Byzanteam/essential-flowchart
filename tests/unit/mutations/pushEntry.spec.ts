import pushEntry from '@/store/mutations/history/pushEntry';

import { createStore } from '../helper';

describe('pushEntry', () => {
  it('increment currentVersion and push entry to entries', () => {
    const store = createStore({});

    const newEntry = {
      mutations: [{
        type: 'foo',
        payload: 'bar',
      }],
    };

    pushEntry(store.state, { entry: newEntry });

    expect(store.state.history.currentVersion).toEqual(1);
    expect(store.state.history.entries).toEqual([newEntry]);
  });
});
