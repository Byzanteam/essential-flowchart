import {
  INode, INodePort, IPosition, FlowchartStore,
} from '@/types';

function findPortEl (el: HTMLElement): HTMLElement | null {
  let curr: HTMLElement | null = el;
  let found = false;
  while (!found && curr) {
    const nodeId = curr.getAttribute && curr.getAttribute('data-node-id');
    const portId = curr.getAttribute && curr.getAttribute('data-port-id');

    found = !!(portId && nodeId);
    if (!found) {
      curr = curr.parentElement;
    }
  }
  return curr;
}

export default function useMouseDownOnPort (store: FlowchartStore, node: INode, port: INodePort) {
  const onMouseDown = (evt: MouseEvent) => {
    const linkId = `${Date.now()}`; // TODO: generate id
    const fromNodeId = node.id;
    const fromPortId = port.id;

    function mouseMoveHandler (e: MouseEvent) {
      const toPosition: IPosition = {
        x: e.x,
        y: e.y,
      };

      store.commit('updateMousePosition', toPosition);
    }

    function mouseUpHandler (e: MouseEvent) {
      store.commit('updateMousePosition', null);

      const portEl = findPortEl(e.target as HTMLElement);

      if (portEl) { // complete link
        const toNodeId = portEl.getAttribute('data-node-id');
        const toPortId = portEl.getAttribute('data-port-id');

        const link = {
          id: linkId,
          from: {
            nodeId: fromNodeId,
            portId: fromPortId,
          },
          to: {
            nodeId: toNodeId,
            portId: toPortId,
          },
        };

        // TODO: validate link
        store.dispatch('addLink', { link })
          .then(valid => {
            if (!valid) {
              store.dispatch('removeLink', { linkId, history: false });
            }
          });
      } else { // cancel link
        store.dispatch('removeLink', { linkId, history: false });
      }

      store.commit('updateMousePosition', null);

      // remove listeners
      window.removeEventListener('mouseup', mouseUpHandler, false);
      window.removeEventListener('mousemove', mouseMoveHandler, false);
    }

    // add link when start
    // TODO: validate link
    store.dispatch('addLink', {
      link: {
        id: linkId,
        from: {
          nodeId: fromNodeId,
          portId: fromPortId,
        },
        to: {},
      },
      history: false,
    }).then(valid => {
      if (valid) {
        // add listeners
        window.addEventListener('mousemove', mouseMoveHandler, false);
        window.addEventListener('mouseup', mouseUpHandler, false);
      }
    });

    // prevent text selection
    evt.preventDefault();
    // prevent node move
    evt.stopPropagation();
  };

  return {
    onMouseDown,
  };
}
