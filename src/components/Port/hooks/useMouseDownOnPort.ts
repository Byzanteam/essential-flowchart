import {
  Id,
  INode, INodePort, IPosition, FlowchartStore,
} from '@/types';

function findTarget (el: HTMLElement): {nodeId: Id; portId: Id} | null {
  let curr: HTMLElement | null = el;
  let target = null;

  while (!target && curr) {
    const nodeId = curr.getAttribute && curr.getAttribute('data-node-id');
    const portId = curr.getAttribute && curr.getAttribute('data-port-id');

    if (portId && nodeId) {
      target = {
        portId,
        nodeId,
      };
    } else {
      curr = curr.parentElement;
    }
  }

  return target;
}

// https://gist.github.com/6174/6062387
function generateUuid (): string {
  return Math.random().toString(36).substring(2, 15);
}

export default function useMouseDownOnPort (store: FlowchartStore, node: INode, port: INodePort) {
  const onMouseDown = (evt: MouseEvent) => {
    const linkId = generateUuid();
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

      const target = findTarget(e.target as HTMLElement);

      if (target) { // complete link
        const {
          nodeId: toNodeId,
          portId: toPortId,
        } = target;

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
