import pushEntry from '@/store/mutations/history/pushEntry';
import { createStore } from '../../../../helper';

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

  it('fork it', () => {
    const store = createStore({});

    const mutation = {
      type: 'foo',
      payload: null,
    };

    pushEntry(store.state, { entry: { mutations: [{ ...mutation, payload: 0 }] } });
    pushEntry(store.state, { entry: { mutations: [{ ...mutation, payload: 1 }] } });
    pushEntry(store.state, { entry: { mutations: [{ ...mutation, payload: 2 }] } });

    store.state.history.currentVersion = 1;

    pushEntry(store.state, { entry: { mutations: [{ ...mutation, payload: 4 }] } });

    expect(store.state.history.currentVersion).toEqual(2);
    expect(store.state.history.entries.map(entry => entry.mutations[0].payload)).toEqual([0, 4]);
  });
});
